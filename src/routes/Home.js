import NewTweet from "components/NewTweet";
import TweetFactory from "components/TweetFactory";
import { dbService } from "fbase";
import { orderBy, onSnapshot, collection, query } from "firebase/firestore";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
    const [newTweets, setNewTweets] = useState([]);
    useEffect(() => {
        const q = query(
            collection(dbService, "new-tweets"),
            orderBy("createdAt", "desc")
        );
        onSnapshot(q, (snapshot) => {
            const nweetArr = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setNewTweets(nweetArr);
        });
    }, []);

    return (
        <div className="container">
            <TweetFactory userObj={userObj} />
            <div style={{ marginTop: 30 }}>
                {
                    newTweets.map(nTweet => {
                        return (
                            <NewTweet key={nTweet.id} tweetObj={nTweet} isOwner={nTweet.creatorId === userObj.uid} />
                        );
                    })
                }
            </div>
        </div>
    );
}

export default Home;