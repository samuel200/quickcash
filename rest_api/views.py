import random
from django.template.loader import render_to_string
from django.conf import settings
from django.core.mail import EmailMessage
from django.urls import reverse

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, JSONParser, FormParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login

from .models import UserDetail, News, TriviaGame, UserTriviaGame, UserSudokuGame, ImagePuzzleGame, UserImagePuzzleGame
from .serializers import *
from .board import Board

import requests
import json
from functools import reduce

paystack_secret_key = "sk_test_18b85ab7edeafba253bed5203248fa8dd2f21a65"

# Create your views here.
@api_view(['GET'])
def index(request):
    return Response(status=200, data={'msg': 'success'})


class LoginView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        try:
            user = User.objects.get(email=email)
        except:
            return Response(status=404, data={"error_message": "User with the provided email is not registered on this platform"})

        user = authenticate(username=user.username, password=password)
        if user:
            login(request, user)
            token, created = Token.objects.get_or_create(user=user)
            return Response(status=200, data={"msg": "user logged in", "key": token.key})

        return Response(status=401, data={"error_message": "Invalid email or password provided"})


class RegistrationView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        firstname = request.data.get('first_name')
        lastname = request.data.get('last_name')
        username = request.data.get('username')
        email = request.data.get('email')
        phone_number = request.data.get('phone_number')
        password = request.data.get('password')
        referree = None

        try:
            referree = request.data.get('referree')
            print(referree)
        except:
            pass

        try:
            user = User(first_name=firstname,
                        last_name=lastname,
                        username=username,
                        email=email,
                        password=password)
            user.set_password(password)
            user.save()

            if referree:
                try:
                    referree_user = User.objects.get(username=referree)
                    user_detail = UserDetail.objects.create(
                        user=user, referree=referree_user, phone_number=phone_number)

                except:
                    return Response(status=400, data={"error_message": "Invalid referree username"})

            else:
                user_detail = UserDetail.objects.create(
                    user=user, phone_number=phone_number)

        except Exception:
            return Response(status=402, data={"error_message": "Error in registration details"})

        return Response(status=200, data={'msg': "The user has been registered."})


def get_refferal_users(user_queryset):
    user_list = []
    for user in user_queryset:
        current_user = User.objects.get(id=user.user_id)
        current_user_serializer = UserSerializer(current_user)
        current_user_detail_serializer = UserDetailSerializer(user)
        user_list.append({**current_user_serializer.data, **
                          current_user_detail_serializer.data})

    return user_list


class UserView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        user = request.user
        user_detail = UserDetail.objects.get(user=user)

        user_serializer = UserSerializer(user)
        user_detail_serializer = UserDetailSerializer(user_detail)
        referrals = get_refferal_users(user_detail.referrals.all())
        transactions = TransactionSerializer(request.user.transaction.all(), many=True).data
            
        #getting the progress of the games
        trivia_count = request.user.trivia_game.filter(answered=True).count()
        sudoku_count = request.user.sudoku_game.filter(answered=True).count()
        image_puzzle_count = request.user.image_puzzle_game.filter(answered=True).count()
        return Response(status=200, data={**user_serializer.data, **user_detail_serializer.data, "referrals": referrals,"transactions": transactions, "games":{"trivia": trivia_count, "sudoku": sudoku_count, "image_puzzle": image_puzzle_count}})

    def put(self, request):
        user_data = {
            "first_name": request.data.get('firstname'),
            "last_name": request.data.get('lastname'),
            "username": request.data.get('username'),
            "email": request.data.get('email')
        }

        user_detail_data = {
            'phone_number': request.data.get('phone_number')
        }

        user = request.user
        user_detail = UserDetail.objects.get(user=user)

        user_serializer = UserSerializer(user, data=user_data, partial=True)
        user_detail_serializer = UserDetailSerializer(
            user_detail, data=user_detail_data, partial=True)

        if user_serializer.is_valid() and user_detail_serializer.is_valid():
            user_serializer.save()
            user_detail_serializer.save()
            referrals = get_refferal_users(user_detail.referrals)
            transactions = TransactionSerializer(request.user.transaction.all(), many=True).data
            
            #getting the progress of the games
            trivia_count = request.user.trivia_game.filter(answered=True).count()
            sudoku_count = request.user.sudoku_game.filter(answered=True).count()
            image_puzzle_count = request.user.image_puzzle_game.filter(answered=True).count()
            return Response(status=200, data={**user_serializer.data, **user_detail_serializer.data, "referrals": referrals, 'transactions': transactions, "games":{"trivia": trivia_count, "sudoku": sudoku_count, "image_puzzle": image_puzzle_count}})

        else:
            return Response(status=402, data={"error_message": user_serializer.errors})


class AccountDetailsView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    parser_classes = [JSONParser, FormParser, MultiPartParser]

    def post(self, request):
        user_detail = UserDetail.objects.get(user=request.user)
        serializer = UserDetailSerializer(
            user_detail, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            # return Response(data=serializer.data, status=201)
            user_data = UserSerializer(request.user).data
            referrals = get_refferal_users(user_detail.referrals)
            transactions = TransactionSerializer(request.user.transaction.all(), many=True).data
            
            #getting the progress of the games
            trivia_count = request.user.trivia_game.filter(answered=True).count()
            sudoku_count = request.user.sudoku_game.filter(answered=True).count()
            image_puzzle_count = request.user.image_puzzle_game.filter(answered=True).count()
            return Response(data={**user_data, **serializer.data, "referrals": referrals, 'transactions': transactions, "games":{"trivia": trivia_count, "sudoku": sudoku_count, "image_puzzle": image_puzzle_count}}, status=200)

        return Response(status=200)

    def put(self, request):
        user = request.user
        user_detail = UserDetail.objects.get(user=user)

        account_details = {'account_name': request.data.get('account_name'),
                           'bank_name': request.data.get('bank_name'),
                           'account_number': request.data.get('account_number')}

        user_detail_serializer_edit = UserDetailSerializer(
            user_detail, data=account_details, partial=True)

        if user_detail_serializer_edit.is_valid():
            user_detail_serializer_edit.save()
            referrals = get_refferal_users(user_detail.referrals)
            transactions = TransactionSerializer(request.user.transaction.all(), many=True).data
            
            #getting the progress of the games
            trivia_count = request.user.trivia_game.filter(answered=True).count()
            sudoku_count = request.user.sudoku_game.filter(answered=True).count()
            image_puzzle_count = request.user.image_puzzle_game.filter(answered=True).count()
            return Response(status=200, data={**(UserSerializer(user).data), **(UserDetailSerializer(user_detail).data), "referrals": referrals, 'transactions': transactions, "games":{"trivia": trivia_count, "sudoku": sudoku_count, "image_puzzle": image_puzzle_count}})

        else:
            return Response(status=402, data={"error_message": "Error editing account details."})

#Add post save to update transactions.
class WithdrawalView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        amount = request.data.get('amount', None)
        user_detail = UserDetail.objects.get(user=request.user)
        total_earnings = user_detail.referral_earnings + user_detail.game_earnings
        pending_withdrawals = Transaction.objects.filter(trans_type='withdrawal', status=False)
        total_pending_amount = reduce(lambda x, y: x.amount + y.amount, list(pending_withdrawals)) if pending_withdrawals.count() > 0 else Transaction(amount=0)
        amount_left = total_earnings - total_pending_amount.amount

        if amount:
            if amount < 5000:
                return Response(status=200, data={'error_message': "Amount is less than minimum withdrawal limit"})
            elif amount > total_earnings:
                return Response(status=200, data={'error_message': "Amount is higher than your total earnings"})
            elif amount >= amount_left:
                return Response(status=200, data={'error_message': "Due to pending withdrawals this request can not be processed"})
            else:
                withdrawal = Transaction(user= request.user, trans_type="withdrawal", amount=amount)
                withdrawal_serializer = TransactionSerializer(withdrawal)
                withdrawal.save()
                return Response(status=200, data={'msg': "Withdrawal request was made successfully", 'transaction': withdrawal_serializer.data})
        else:
            return Response(status=400, data={'error_message': "Missing amount query"})


class DepositView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        reference = request.data.get('ref', None)
        amount = request.data.get('amount', None)

        if reference and amount:
            try:
                req = requests.get(f"https://api.paystack.co/transaction/verify/{reference}", headers={'Authorization': f"Bearer {paystack_secret_key}"})
                res = req.json()
                if res['status']:
                    transaction = Transaction(amount=amount/100, trans_type="deposit", user=request.user, status=True)
                    transaction.save()
                    return Response(status=200, data={'msg': "Deposit create", 'transaction': TransactionSerializer(transaction).data})
                else:
                    return Response(status=500)
            except:
                return Response(status=400, data={'error_message': 'error making payment'.capitalize()})
            # return Response()
        else:
            return Response(status=400, data={'error_message': "Payment token not provided"})


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')

        user = request.user

        if user.check_password(old_password):
            if old_password != new_password:
                user.set_password(new_password)
                user.save()
                return Response(status=200, data={'msg': "Password Changed Successfully"})
            else:
                return Response(status=402, data={'error_message': "New Password Can Not Be The Same As The Current"})
        else:
            return Response(status=401, data={'error_message': "Invalid Existing Password Inputted"})


class ForgotPasswordView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        email = request.data.get('email')

        try:
            user = User.objects.get(email=email)
            template = render_to_string('emails/password-reset-email-template.html', {
                                        'link': reverse("backend:reset", kwargs={'id': user.id})})

            if user:
                email = EmailMessage(
                    'QuickCash Account Password Reset',
                    template,
                    "<support@quickcash.com>",
                    [email]
                )
                email.content_subtype = "html"
                email.fail_silently = False
                email.send()

        except User.DoesNotExist:
            return Response(status=404)

        return Response({"msg": "Password Reset Request Has Been Sent Succesfully, Check Your Email For Our Response."})


class ResetPasswordView(APIView):
    permission_classes = []
    authentication_classes = []

    def put(self, request, id):
        try:
            user = User.objects.get(id=id)
            password = request.data.get('password')

            if user.check_password(password):
                return Response(status=403, data={'error_message': 'New Password Cannot Be The Same As The Last'})
            else:
                user.set_password(password)

        except:
            return Response(status=404)

        return Response({'msg': 'Password Update Was Successful'})


class NewsView(APIView):
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        news = News.objects.all()
        news_serializer = NewsSerializer(news, many=True)
        return Response(status=200, data=news_serializer.data)

    def post(self, request):
        topic = request.data.get("topic")
        req = requests.get(
            f"https://newsapi.org/v2/everything?q={topic}&apiKey=dae1f7dba008456a8bf54a246ed98e46")

        for data in req.json().get("articles"):
            news = News(news_type=topic, title=data.get("title"), image_url=data.get("urlToImage"),
                        post_url=data.get("url"), description=data.get("description"), published_at=data.get("publishedAt"),
                        source=data["source"].get("name"))
            news.save()

        return Response(status=200, data={"msg": f"{topic} news created and saved"})


class ContactUsView(APIView):
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        try:
            template = render_to_string('emails/contact-us-email-template.html',
                                        {'name': request.data.get('name'),
                                         'subject': request.data.get('subject'),
                                         'email': request.data.get('email'),
                                         'message': request.data.get('message')})

            email = EmailMessage(request.data.get('subject'),
                                 template,
                                 '<support@quickcash.com>',
                                 [request.data.get('email')])

            email.fail_silently = False
            email.send()

            return Response(status=200, data={"msg": "email sent successfully"})

        except:
            return Response(status=403, data={"error_message": "email failed to send try again later"})


def chooseRandomGames(queryset, limit):
    count = 0
    result = []

    while count < limit:
        index = random.randint(
            0, len(queryset)-1) if len(queryset)-1 > 0 else 0
        result.append(queryset[index])
        del queryset[index]
        count += 1

    return result


def convertListToString(queryset):
    result = ''

    if queryset:
        for query in queryset:
            result += query + ","

    return result


class TriviaQuestionsGenerationView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        command = request.data.get('command', None)

        if request.user.is_staff:
            if command == "create":
                easy_response = requests.get(
                    "https://opentdb.com/api.php?amount=500&difficulty=easy")
                medium_response = requests.get(
                    "https://opentdb.com/api.php?amount=30&difficulty=medium")
                hard_response = requests.get(
                    "https://opentdb.com/api.php?amount=20&difficulty=hard")

                for question in easy_response.json()['results']:
                    question['incorrect_answers'].append(
                        question['correct_answer'])

                    game = TriviaGame(difficulty=question['difficulty'],
                                      question=question['question'],
                                      answer=question['correct_answer'],
                                      options=convertListToString(
                                          question['incorrect_answers']),
                                      )
                    game.save()

                for question in medium_response.json()['results']:
                    question['incorrect_answers'].append(
                        question['correct_answer'])

                    game = TriviaGame(difficulty=question['difficulty'],
                                      question=question['question'],
                                      answer=question['correct_answer'],
                                      options=convertListToString(
                                          question['incorrect_answers']),
                                      )
                    game.save()

                for question in hard_response.json()['results']:
                    question['incorrect_answers'].append(
                        question['correct_answer'])

                    game = TriviaGame(difficulty=question['difficulty'],
                                      question=question['question'],
                                      answer=question['correct_answer'],
                                      options=convertListToString(
                                          question['incorrect_answers']),
                                      )
                    game.save()

            elif command == "update":
                user_details = UserDetail.objects.all()

                for user_detail in user_details:
                    hard_games = []
                    medium_games = []
                    easy_games = []
                    user_game = []

                    if user_detail.level == 1:
                        hard_games = chooseRandomGames(
                            list(TriviaGame.objects.filter(difficulty="hard")), 5)
                        medium_games = chooseRandomGames(
                            list(TriviaGame.objects.filter(difficulty="medium")), 7)
                        easy_games = chooseRandomGames(
                            list(TriviaGame.objects.filter(difficulty="easy")), 8)

                    elif user_detail.level == 2:
                        hard_games = chooseRandomGames(
                            list(TriviaGame.objects.filter(difficulty="hard")), 5)
                        medium_games = chooseRandomGames(
                            list(TriviaGame.objects.filter(difficulty="medium")), 10)
                        easy_games = chooseRandomGames(
                            list(TriviaGame.objects.filter(difficulty="easy")), 5)

                    elif user_detail.level == 3:
                        hard_games = chooseRandomGames(
                            list(TriviaGame.objects.filter(difficulty="hard")), 10)
                        medium_games = chooseRandomGames(
                            list(TriviaGame.objects.filter(difficulty="medium")), 7)
                        easy_games = chooseRandomGames(
                            list(TriviaGame.objects.filter(difficulty="easy")), 3)

                    elif user_detail.level == 4:
                        hard_games = chooseRandomGames(
                            list(TriviaGame.objects.filter(difficulty="hard")), 10)
                        medium_games = chooseRandomGames(
                            list(TriviaGame.objects.filter(difficulty="medium")), 10)
                        easy_games = chooseRandomGames(
                            list(TriviaGame.objects.filter(difficulty="easy")), 0)

                    user_games = chooseRandomGames(
                        [*hard_games, *medium_games, *easy_games], 20)

                    for game in user_games:
                        user_game = UserTriviaGame(user=user_detail.user, difficulty=game.difficulty,
                                                   question=game.question, answer=game.answer,
                                                   options=game.options)

                        user_game.save()

            elif command == "reset":
                for detail in list(UserDetail.objects.all()):
                    detail.level = 1
                    detail.save()

                trivia_games = TriviaGame.objects.all()
                trivia_games.delete()

                user_trivia_games = UserTriviaGame.objects.all()
                user_trivia_games.delete()

            else:
                return Response(status=403, data={'error_message': 'Invalid Command'})

            return Response(status=200, data={'msg': 'Trivia Game Updated Successfully'})

        else:
            return Response(status=401)


class TriviaGameView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def get(self, request):
        trivia_questions = UserTriviaGame.objects.filter(user=request.user)
        trivia_serializer = UserTriviaGameSerializer(
            trivia_questions, many=True)
        return Response(status=200, data=trivia_serializer.data)

    def post(self, request):
        _id = request.data['id']
        answer = request.data.get('answer', None)
        question = UserTriviaGame.objects.get(id=_id)

        if not question.answered:
            if answer and answer == question.answer:
                question.correct = True
                question.answered = True
                question.save()
                return Response(data={"msg": "correct"})

            else:
                question.correct = False
                question.answered = True
                question.save()
                return Response(data={"msg": "wrong"})


        else:
            return Response(status=403, data={"error_message": "question already answered"})


class SudokuBoardGenerationView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        if request.user.is_staff:
            users = list(User.objects.filter(is_staff=False))

            for user in users:
                prob = random.random()
                easy_prob = 0
                medium_prob = 0
                hard_prob = 1
                user_details = UserDetail.objects.get(user=user)

                for _ in range(20):
                    sudoku_game = UserSudokuGame()

                    if user_details.level == 1:
                        easy_prob = .4
                        medium_prob = .75

                    elif user_details.level == 2:
                        easy_prob = .3
                        medium_prob = .75

                    elif user_details.level == 3:
                        easy_prob = .2
                        medium_prob = .6
                    
                    elif user_details.level == 4:
                        easy_prob = .1
                        medium_prob = .45
                    
                    else:
                        return Response(status=400)

                    if prob < easy_prob:
                        sudoku_game.difficulty = 'easy'

                    elif prob < medium_prob:
                        sudoku_game.difficulty = 'medium'

                    else:
                        sudoku_game.difficulty = 'hard'
                        
                    sudoku_game.user = user
                    
                    board = Board()
                    sudoku_game.board = board.random_board(sudoku_game.difficulty)
                    sudoku_game.current_board = sudoku_game.board
                    sudoku_game.save()
            
            return Response(status=200, data={'msg': 'End-point setup successfully :)'})

        else:
            return Response(status=403)


class UserSodokuGameView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
    
    def get(self, request):
        game = UserSudokuGameSerializer(request.user.sudoku_game.filter(answered=False).first())

        return Response(status=200, data=game.data)

    def post(self, request):
        _id = request.data.get('id', None)
        cells = request.data.get('cells', None)

        print(request.data['id'])

        if not _id or not cells:
            return Response(status=403, data={"error_message": "Invalid game instance provided"})

        else:
            sudoku_game = UserSudokuGame.objects.get(id=_id)
            board = Board()
            
            if board.is_solved(cells):
                sudoku_game.correct = True
                if sudoku_game.answered:
                    return Response(status=403, data={"error_message": "Puzzle Already Solved"})
                else:
                    sudoku_game.answered = True
                    sudoku_game.save()
                    return Response(status=200, data={'msg': 'correct'})
                
            else:
                sudoku_game.correct = False
                sudoku_game.answered = True
                sudoku_game.save()
                return Response(status=200, data={'msg': 'wrong'})
                

class SaveSudokuGameView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def put(self, request):
        _id = request.data.get('id', None)
        board = request.data.get('board', None)
        time = request.data.get('time', None)
        
        if _id and board:
            game = request.user.sudoku_game.get(id=_id)
            game.current_board = board
            game.time = time
            game.save()
            return Response(data={"msg": "game saved".capitalize()})
        return Response(data={'error_message': "incomplete lookup details".capitalize()})


class ImagePuzzleGenerationView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request):
        if request.user.is_staff:
            if request.data['command'] == "retrieve":
                req = [requests.get("https://api.unsplash.com/photos/random?count=30&client_id=q8dlboOTaYYPUnsOGmcud88O2KltjJSTqDBP18Ad6PA"),
                        requests.get("https://api.unsplash.com/photos/random?count=30&client_id=q8dlboOTaYYPUnsOGmcud88O2KltjJSTqDBP18Ad6PA"),
                        requests.get("https://api.unsplash.com/photos/random?count=30&client_id=q8dlboOTaYYPUnsOGmcud88O2KltjJSTqDBP18Ad6PA"),
                        requests.get("https://api.unsplash.com/photos/random?count=10&client_id=q8dlboOTaYYPUnsOGmcud88O2KltjJSTqDBP18Ad6PA")]
                data = [*req[0].json(), *req[1].json(), *req[2].json(), *req[3].json()]

                for img in data:
                    image_url = img['links']['html']
                    image_puzzle = ImagePuzzleGame(image_url=image_url)
                    image_puzzle.save()

                return Response(status=200, data={'msg': "games retrieved successfully".capitalize()})


            elif request.data['command'] == "create":
                users = list(User.objects.filter(is_staff=False))

                for user in users:
                    image_puzzle_list = list(ImagePuzzleGame.objects.all())
                    for _ in range(20):
                        max_index = len(image_puzzle_list)-1
                        random_index = random.randint(0, max_index)

                        image_puzzle = image_puzzle_list[random_index]
                        new_puzzle = UserImagePuzzleGame(user=user, image_url=image_puzzle.image_url)
                        new_puzzle.save()
                        
                        del image_puzzle_list[random_index]
                        max_index -= 1

                return Response(status=200, data={'msg': "user image puzzles created successfully".capitalize()})

            else:
                return Response(status=400, data={'error_message': "invalid command".capitalize()})


class ImagePuzzleGameView(APIView): 
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]
 
    def get(self, request):
        image_puzzle = request.user.image_puzzle_game.filter(answered=False).first()
        image_puzzle_serializer = UserImagePuzzleGameSerializer(image_puzzle)
        return Response(data=image_puzzle_serializer.data, status=200)

    def post(self, request):
        _id = request.data.get('id', None)
        correct = request.data.get('correct', None)

        if _id and correct != None:
            try:
                game = request.user.image_puzzle_game.get(id=_id)
                game.answered = True
                game.correct = correct
                game.save()
                return Response(status=200, data={'msg': 'correct' if correct else 'wrong'})
            except:
                return Response(status=400, data={'error_message': "invalid user id".capitalize()})


        else:
            return Response(status=400, data={'error_message': "query parameters missing".capitalize()})