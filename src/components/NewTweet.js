import React, { useState } from "react";
import { dbService, storageService } from "fbase";
import { deleteObject, ref } from "@firebase/storage";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const NewTweet = ({ tweetObj, isOwner }) => {
    const [editing, setEditing] = useState(false);
    const [updateText, setUpdateText] = useState("");
    const NweetTextRef = doc(dbService, "new-tweets", `${tweetObj.id}`);
    const attachmentRef = ref(storageService, tweetObj.attachmentUrl);
    const onDeleteClick = async (event) => {
        const getConfirm = window.confirm("Are you sure you want to delete this tweet?");
        if (getConfirm) {
            try {
                await deleteDoc(NweetTextRef);
                await deleteObject(attachmentRef);
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    const onSubmit = async (event) => {
        event.preventDefault();
        await updateDoc(NweetTextRef, {
            text: updateText,
        });
        setUpdateText("");
        setEditing(false);
    }
    const onChange = (event) => {
        const { target: { value } } = event;
        setUpdateText(value);
    }
    const toggleEditing = () => setEditing(prev => !prev);
    return (
        <div className="nweet">
            {
                editing ?
                    (
                        <>
                            <form className="container nweetEdit" onSubmit={onSubmit}>
                                <input
                                    type="text"
                                    placeholder="Edit your nweet"
                                    value={updateText}
                                    required
                                    autoFocus
                                    onChange={onChange}
                                    className="formInput"
                                />
                                <input type="submit" value="Update Nweet" className="formBtn" />
                            </form>
                            <span onClick={toggleEditing} className="formBtn cancelBtn">Cancel</span>
                        </>
                    )
                    :
                    (
                        <>
                            <h4>{tweetObj.text}</h4>
                            {
                                tweetObj.attachmentUrl && <img alt="" src={tweetObj.attachmentUrl} />
                            }
                            {
                                isOwner &&
                                <div className="nweet__actions">
                                    <span onClick={onDeleteClick}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </span>
                                    <span onClick={toggleEditing}>
                                        <FontAwesomeIcon icon={faPencilAlt} />
                                    </span>
                                </div>
                            }
                        </>
                    )
            }
        </div>
    );
}

export default NewTweet;