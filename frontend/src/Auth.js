import domainName from "./DomainName";

class Auth{
    constructor(){
        this.authenticatedUser = null;
        this.authenticationToken = null;
        this.isAuthenticated = false;
        const savedAuthObject = JSON.parse(localStorage.getItem('savedAuthObject'));
        
        if(savedAuthObject && savedAuthObject.isAuthenticated){
            if(savedAuthObject.authenticatedUser && savedAuthObject.authenticationToken){
                this.isAuthenticated = savedAuthObject.isAuthenticated
                this.authenticatedUser = savedAuthObject.authenticatedUser;
                this.authenticationToken = savedAuthObject.authenticationToken;
            }else{
                this.resetAuth();
            }
        }else if(!savedAuthObject){
            localStorage.setItem('savedAuthObject', JSON.stringify(this.resetAuth()))
        }
        if(this.authenticationToken){
            this.login(this.authenticationToken, ()=>{})
        }
        this.saveAuthObject();
    }

    logout(cb){
        this.resetAuth();
        this.saveAuthObject();
        cb();
    }

    login(token, cb){
        fetch(`${domainName}/api/user`, {headers:{"Authorization": `Token ${token}`}, method: "GET"})
            .then(response => response.json())
            .then(data =>{
                if(!data.detail){
                    this.authenticationToken = token;
                    this.authenticatedUser = data;
                    this.isAuthenticated = true;
                    this.saveAuthObject();
                    cb(data);
                }
            })
            .catch(err=>{
                alert(err);
                this.authenticatedUser = null;
                this.authenticationToken = null
                this.isAuthenticated = false;
                this.saveAuthObject();
            })
    }

    resetAuth(){
        this.authenticatedUser = null;
        this.authenticationToken = null;
        this.isAuthenticated = false;
        return {
            authenticationToken: null,
            authenticatedUser: null,
            isAuthenticated: false
        }
    }

    saveAuthObject(){
        const savedAuthObject = {
            authenticationToken: this.authenticationToken,
            authenticatedUser: this.authenticatedUser,
            isAuthenticated: this.isAuthenticated
        }
        localStorage.setItem('savedAuthObject', JSON.stringify(savedAuthObject));
    }
}


export default new Auth();