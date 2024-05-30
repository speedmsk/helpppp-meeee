import register from '/register.svg';
import log from '/log.svg'

export default function images()
{
    return(
        <>
        <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>Nouveau ici ?</h3>
            <p>
            Créez votre compte dès maintenant et débloquez un monde de possibilités ! 
            Rejoignez-nous aujourd'hui et découvrez une facilité d'inscription comme jamais auparavant.
            </p>
            <button className="btni solid transparent" id="sign-up-btn">
              Sign up
            </button>
          </div>
          <img src={log} className="image" alt="" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>Un des nôtres ?</h3>
            <p>
            
Accédez à votre compte sans effort et en toute sécurité. 
Connectez-vous maintenant pour explorer des fonctionnalités personnalisées et rester connecté avec facilité !
            </p>
            <button className="btni transparent" id="sign-in-btn">
              Sign in
            </button>
          </div>
          <img src={register} className="image" alt="" />
        </div>
      </div>
        </>
    )
}