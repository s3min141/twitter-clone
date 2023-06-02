import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { addDoc, collection } from "firebase/firestore";
import { ref, uploadString, getDownloadURL } from "@firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const TweetFactory = ({ userObj }) => {
    const [newTweet, setNewTweet] = useState("");
    const [attachment, setAttachment] = useState("");

    const onChange = (event) => {
        const { target: { value } } = event;
        setNewTweet(value);
    }
    const onSubmit = async (event) => {
        if (newTweet === "") {
            return;
        }

        event.preventDefault();
        let attachmentUrl = "";

        if (attachment !== "") {
            const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
            const response = await uploadString(attachmentRef, attachment, "data_url");

            attachmentUrl = await getDownloadURL(response.ref);
        }

        try {
            const docRef = await addDoc(collection(dbService, "new-tweets"), {
                text: newTweet,
                createdAt: Date.now(),
                creatorId: userObj.uid,
                attachmentUrl
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }

        setAttachment("");
        setNewTweet("");
    }
    const onFileChange = (event) => {
        const { target: { files } } = event;
        const theFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishEvent) => {
            const { currentTarget: { result } } = finishEvent;
            setAttachment(result);
        };
        reader.readAsDataURL(theFile);
    }
    const onClearAttachmentClick = () => setAttachment("");

    return (
        <form onSubmit={onSubmit} className="factoryForm">
            <div className="factoryInput__container">
                <input
                    className="factoryInput__input"
                    value={newTweet}
                    onChange={onChange}
                    type="text"
                    placeholder="What's on your mind?"
                    maxLength={120}
                />
                <input type="submit" value="&rarr;" className="factoryInput__arrow" />
            </div>
            <label htmlFor="attach-file" className="factoryInput__label">
                <span>Add photos</span>
                <FontAwesomeIcon icon={faPlus} />
            </label>
            <input
                id="attach-file"
                type="file"
                accept="image/*"
                onChange={onFileChange}
                style={{
                    opacity: 0,
                }}
            />
            {attachment && (
                <div className="factoryForm__attachment">
                    <img
                        alt=""
                        src={attachment}
                        style={{
                            backgroundImage: attachment,
                        }}
                    />
                    <div className="factoryForm__clear" onClick={onClearAttachmentClick}>
                        <span>Remove</span>
                        <FontAwesomeIcon icon={faTimes} />
                    </div>
                </div>
            )}
        </form>
    );
}

export default TweetFactory;