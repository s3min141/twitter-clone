import React from "react";
import { HashRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "routes/Home";
import Auth from "routes/Auth";
import Navigation from "components/Navigation";
import Profile from "routes/Profile";

const AppRouter = ({ refreshUser, isLoggedIn, userObj }) => {
    return (
        <Router>
            {isLoggedIn && <Navigation userObj={userObj} />}
            <div
                style={{
                    maxWidth: 890,
                    width: "100%",
                    margin: "0 auto",
                    marginTop: 80,
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Routes>
                    {isLoggedIn ?
                        <>
                            <Route exact path="/" element={<Home userObj={userObj} />} />
                            <Route exact path="/profile" element={<Profile refreshUser={refreshUser} userObj={userObj} />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </>
                        :
                        <>
                            <Route exact path="/" element={<Auth />} />
                            <Route path="*" element={<Navigate to="/" />} />
                        </>
                    }
                </Routes>
            </div>
        </Router>
    );
}

export default AppRouter;