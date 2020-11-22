from django.urls import path
from .views import *


app_name = 'api'

urlpatterns = [
    path('', index),
    path('login', LoginView.as_view()),
    path('register', RegistrationView.as_view()),
    path('user', UserView.as_view()),
    path('news', NewsView.as_view()),
    path('user/withdrawal', WithdrawalView.as_view()),
    path('user/deposit', DepositView.as_view()),
    path('user/gen/trivia', TriviaQuestionsGenerationView.as_view()),
    path('user/gen/sudoku', SudokuBoardGenerationView.as_view()),
    path('user/game/trivia', TriviaGameView.as_view()),
    path('user/game/sudoku', UserSodokuGameView.as_view()),
    path('user/save/sudoku', SaveSudokuGameView.as_view()),
    path('user/gen/image-puzzle', ImagePuzzleGenerationView.as_view()),
    path('user/game/image-puzzle', ImagePuzzleGameView.as_view()),
    path('user/account/', AccountDetailsView.as_view()),
    path('user/change-password/', ChangePasswordView.as_view()),
    path('user/forgot-password/', ForgotPasswordView.as_view()),
    path('user/reset-password/<int:id>/', ResetPasswordView.as_view(), name="reset-password"),
    path('contact/', ContactUsView.as_view()),
]
