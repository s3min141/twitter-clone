import { authService } from "fbase";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faTwitter,
    faGoogle,
    faGithub,
} from "@fortawesome/free-brands-svg-icons";
import {
    GithubAuthProvider,
    GoogleAuthProvider,
    signInWithPopup,
} from "@firebase/auth";
import AuthForm from "components/AuthForm";

const Auth = () => {
    const onSocialClick = async (event) => {
        const { target: { name } } = event;
        let provider;

        try {
            if (name === "google") {
                provider = new GoogleAuthProvider();
                await signInWithPopup(authService, provider);
            }
            else if (name === "github") {
                provider = new GithubAuthProvider();
                await signInWithPopup(authService, provider);
            }
        }
        catch (error) {
            console.log(error);
        }
    }
    return (
        <div>
            <div className="authContainer">
                <FontAwesomeIcon
                    icon={faTwitter}
                    color={"#04AAFF"}
                    size="3x"
                    style={{ marginBottom: 30 }}
                />
                <AuthForm />
                <div className="authBtns">
                    <button onClick={onSocialClick} name="google" className="authBtn">
                        Continue with Google <FontAwesomeIcon icon={faGoogle} />
                    </button>
                    <button onClick={onSocialClick} name="github" className="authBtn">
                        Continue with Github <FontAwesomeIcon icon={faGithub} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Auth;