import React, { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import moment from 'moment';
import 'moment/locale/ja';


interface accepttedContentData {
    name: string,
    gender: string,
    age: string,
    address: string,
    message: string,
}

interface ISubmitIndicatorArgs {
    formValues: accepttedContentData,
    onCloseModal: () => void
}

export function createTextForAccepttedContent(data: accepttedContentData) {

    const textTemplate = `※ご意見フォーム送信フェイク※
    下記内容で承りました。
    
    【氏名】$name
    【性別】$gender
    【年齢】$age歳
    【住所】$address
    【ご意見内容】
    $message
    
    -----------------------
    
    受理日時：$date
    
    `;

    // convert gender:int to string
    data.gender = ["その他", "男性", "女性"][Number(data.gender)];

    let text = textTemplate;
    let key: keyof accepttedContentData;
    for (key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
            text = text.replace("$" + key, data[key]);
        }
    }
    text = text.replace("$date", moment().format("YYYY年MM月DD日"));

    return text;
}

export function createTextBlob(text: string) {
    const blob = new Blob([text], { type: "text/plain" });
    return URL.createObjectURL(blob);
}

export function SubmitIndicator({ formValues, onCloseModal }: ISubmitIndicatorArgs) {

    const [data, setData] = useState<accepttedContentData>(formValues);

    const onClickDownload = () => {
        const text = createTextForAccepttedContent(data);
        const link = document.createElement("a");
        link.download = "受理内容.txt";
        link.href = createTextBlob(text);

        link.click();

        URL.revokeObjectURL(link.href);
    };

    const onClickClose = () => {
        onCloseModal();
    };

    return (
        <>
            <div id="modal-container" >
                <div id="modal-box">
                    <div id="modal-message">ご意見を受け付けました。</div>
                    <button id="modal-download" onClick={onClickDownload}>送信内容のダウンロード</button>
                    <div id="modal-close" tabIndex={0}
                        role="button" aria-label="閉じる"
                        onClick={onClickClose}
                    >✕</div>
                </div>
            </div>
            <div id="cover-div" ></div>
        </>
    )
}