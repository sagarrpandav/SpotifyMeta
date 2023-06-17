import {useState} from "react";
import {checkEmail} from "../utils";
import axios from "axios";
import {Loader} from "./Loader";

export const RequestForm = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(0);

    const requestAccess = async () => {
        if (name != '' && checkEmail(email)) {
            try {
                setSubmitted(1);
                const res = await axios({
                    url: '/request-access',
                    method: 'post',
                    data: JSON.stringify({name, email}),
                    headers: {
                        'content-type': 'application/json'
                    }
                });
                setSubmitted(2);
            } catch (e) {
                console.error(e);
            }

        } else {
            window.alert("Enter name and valid email!");
        }
    }

    return (
        <>
            {submitted === 2 ? (<div style={{display: "flex", flexDirection: "column", width: "50vw", margin: "auto", gap: '1.5vh'}}>
                <h1>Hi {name}, your request has been submitted and will be approved by the developer soon !</h1>
            </div>) : (submitted === 1 ? (<Loader/>) : (
                <div
                    style={{display: "flex", flexDirection: "column", width: "50vw", margin: "auto", gap: '1.5vh'}}>
                    <>
                        <label htmlFor="name">Enter your Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} id="name" type="text"/>
                    </>
                    <>
                        <label htmlFor="email">Enter your Spotify Email</label>
                        <input value={email} onChange={(e) => setEmail(e.target.value)} id="email" type="email"/>
                    </>
                    <button onClick={requestAccess}>Request Access!</button>
                </div>))}
        </>
    );
};