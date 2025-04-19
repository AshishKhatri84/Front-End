import React, { useState, useEffect, useRef } from 'react';
import RecordRTC, { invokeSaveAsDialog } from 'recordrtc';
import './Chat.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

function Chat() {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [fileUrl, setFileUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const [fileType, setFileType] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isRecording, setIsRecording] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const [contextMenu, setContextMenu] = useState(null); // State for context menu
    const [selectedMessage, setSelectedMessage] = useState(null); // State for selected message
    const recorderRef = useRef(null);
    const chatBoxRef = useRef(null);
    const fileInputRef = useRef(null);
    const sendButtonRef = useRef(null);
    const timerRef = useRef(null);

    useEffect(() => {
        // Scroll chat box to bottom
        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
        }, [messages]);

        useEffect(() => {
            if (isRecording && !isPaused) {
                timerRef.current = setInterval(() => {
                    setRecordingTime(prevTime => prevTime + 1);
                }, 1000);
            } else {
                clearInterval(timerRef.current);
            }
    
            return () => clearInterval(timerRef.current);
        }, [isRecording, isPaused]);

    const sendMessage = () => {
        if (inputMessage.trim() !== '') {
            const timestamp = new Date().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}); // Get current time with hour and minute only
            // Create the new message object with the properties from the first sendMessage function
            const newMessage = {
                content: inputMessage,
                timestamp: timestamp,
                sender: 'sender'
            };
            // Simulate alternating senders for demonstration
            const sender = messages.length % 2 === 0 ? 'sender1' : 'sender2';
            // Merge the properties from the second sendMessage function
            const mergedMessage = {
                ...newMessage,
                sender: sender
            };
            setMessages([...messages, mergedMessage]);
            setInputMessage('');
            document.getElementById('message-input').focus(); // Focus input field
        }
    };
    
    const toggleEmojiPicker = () => {
        setShowEmojiPicker(!showEmojiPicker);
    };

    const handleEmojiClick = (emoji) => {
        setInputMessage((prevInputMessage) => prevInputMessage + emoji);
        document.getElementById('message-input').focus(); // Focus input field
    };

    const startRecording = () => {
        navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
            recorderRef.current = new RecordRTC(stream, {
                type: 'audio',
                mimeType: 'audio/webm',
                bitsPerSecond: 128000,
            });
            recorderRef.current.startRecording();
            setIsRecording(true);
            setIsPaused(false);
            setRecordingTime(0);
        }).catch(error => {
            console.error("Error accessing microphone: ", error);
        });
    };

    const stopRecording = () => {
        recorderRef.current.stopRecording(() => {
            let blob = recorderRef.current.getBlob();
            invokeSaveAsDialog(blob);
            const url = URL.createObjectURL(blob);

            setMessages([...messages, { sender: 'sender1', content: url, type: 'audio', timestamp: new Date().toLocaleTimeString() }]);
            setIsRecording(false);
            setIsPaused(false);
            setRecordingTime(0);
        });
    };

    const pauseRecording = () => {
        recorderRef.current.pauseRecording();
        setIsPaused(true);
    };

    const resumeRecording = () => {
        recorderRef.current.resumeRecording();
        setIsPaused(false);
    };

    const handleMicrophoneClick = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const handlePauseResumeClick = () => {
        if (isPaused) {
            resumeRecording();
        } else {
            pauseRecording();
        }
    };
    
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
    
    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setFileUrl(event.target.result);
                setFileType(file.type);
                setFileName(file.name);
                if (sendButtonRef.current) {
                    sendButtonRef.current.focus();
                }
            };
            reader.readAsDataURL(file);
            fileInputRef.current.value = '';
        }
    };

    const handleSend = () => {
        const newMessage = {
            content: inputMessage,
            fileUrl: fileUrl,
            fileName: fileName,
            fileType: fileType,
            timestamp: new Date().toLocaleTimeString()
        };
        setMessages([...messages, newMessage]);
        setInputMessage('');
        setFileUrl('');
        setFileName('');
        setFileType('');
    };

    const getFileIcon = (type) => {
        if (type.includes('pdf')) return <i className="fas fa-file-pdf"></i>;
        if (type.includes('msword') || type.includes('wordprocessingml.document')) return <i className="fas fa-file-word"></i>;
        if (type.includes('presentationml.presentation') || type.includes('powerpoint')) return <i className="fas fa-file-powerpoint"></i>;
        return <i className="fas fa-file"></i>;
    };

    const handleContextMenu = (event, message) => {
        event.preventDefault();
        setContextMenu({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
        setSelectedMessage(message);
    };

    const handleClose = () => {
        setContextMenu(null);
        setSelectedMessage(null);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(selectedMessage.content);
        handleClose();
    };

    const handleDelete = () => {
        setMessages(messages.filter(message => message !== selectedMessage));
        handleClose();
    };
    
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    };  
    const handleSendClick = () => {
        handleSend();
        sendMessage();
    };

    const emojis = [
        { category: 'Smileys 😀', emojis: ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '😘', '😗', '😙', '😚', '😋', '😜', '😝', '😛', '🤑', '🤗', '🤓', '😎', '🤠', '🤡', '😏', '😒', '😞', '😔', '😟', '😕', '🙁', '😣', '😖', '😫', '😩', '😤', '😠', '😡', '😶', '😐', '😑', '😯', '😦', '😧', '😮', '😲', '😵', '😳', '😱', '😨', '😰', '😢', '😥', '🤤', '😭', '😓', '😪', '😴', '🙄', '🤔', '🤥', '😬', '🤐', '🤢', '🤧', '😷', '🤒', '🤕', '😈', '👿', '👹', '👺', '💀', '👻', '👽', '👾', '🤖', '💩', '😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾',] },
        { category: 'People 🙍', emojis: ['👶', '👦', '👧', '👨', '👩', '👴', '👵', '👨‍⚕️', '👩‍⚕️', '👨‍🎓', '👩‍🎓', '👨‍⚖️', '👩‍⚖️', '👨‍🌾', '👩‍🌾', '👨‍🍳', '👩‍🍳', '👨‍🔧', '👩‍🔧', '👨‍🏭', '👩‍🏭', '👨‍💼', '👩‍💼', '👨‍🔬', '👩‍🔬', '👨‍💻', '👩‍💻', '👨‍🎤', '👩‍🎤', '👨‍🎨', '👩‍🎨', '👨‍✈️', '👩‍✈️', '👨‍🚀', '👩‍🚀', '👨‍🚒', '👩‍🚒', '👮', '🕵️‍♂️', '🕵️‍♀️', '💂', '👷', '🤴', '👸', '👳', '👲', '🧕', '🤵', '👰', '🤰', '🤱', '👼', '🎅', '🤶', '🦸‍♂️', '🦸‍♀️', '🦹‍♂️', '🦹‍♀️', '🧙‍♂️', '🧙‍♀️', '🧚‍♂️', '🧚‍♀️', '🧛‍♂️', '🧛‍♀️', '🧜‍♂️', '🧜‍♀️', '🧝‍♂️', '🧝‍♀️', '🧞‍♂️', '🧞‍♀️', '🧟‍♂️', '🧟‍♀️', '🙍', '🙎', '🙅', '🙆', '💁', '🙋', '🙇', '🤦', '🤷', '💆', '💇', '🚶', '🏃', '💃', '🕺', '👯', '🧖‍♂️', '🧖‍♀️', '🧘‍♂️', '🧘‍♀️', '🛀', '🛌', '🕴️',] },
        { category: 'Animals 🐹', emojis: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🦝', '🐻', '🐼', '🦘', '🦡', '🐨', '🐯', '🦁', '🐮', '🐷', '🐽', '🐸', '🐵', '🙈', '🙉', '🙊', '🐒', '🐔', '🐧', '🐦', '🐤', '🐣', '🐥', '🦆', '🦢', '🦅', '🦉', '🦚', '🦜', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋', '🐌', '🐚', '🐞', '🐜', '🦗', '🕷️', '🕸️', '🦂', '🦟', '🦠', '🌸', '💮', '🏵️', '🌹', '🥀', '🌺', '🌻', '🌼', '🌷', '🌱', '🌲', '🌳', '🌴', '🌵', '🌾', '🌿', '☘️', '🍀', '🍁', '🍂', '🍃', '🍄', '🌰', '🦀', '🦞', '🦐', '🦑', '🌍', '🌎', '🌏', '🌐', '🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘', '🌙', '🌚', '🌛', '🌜', '☀️', '🌝', '🌞', '⭐', '🌟', '🌠', '☁️', '⛅', '⛈️', '🌤️', '🌥️', '🌦️', '🌧️', '🌨️', '🌩️', '🌪️', '🌫️', '🌬️', '🌀', '🌈', '🌂', '☂️', '☔', '⛱️', '⚡', '❄️', '☃️', '⛄', '☄️', '🔥', '💧', '🌊',] },
        { category: 'Food 🍕', emojis: ['🍏', '🍎', '🍐', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🍈', '🍒', '🍑', '🥭', '🍍', '🥥', '🥝', '🍅', '🍆', '🥑', '🥦', '🥒', '🌶️', '🌽', '🥕', '🥔', '🍠', '🥐', '🍞', '🥖', '🥨', '🥯', '🧀', '🥚', '🍳', '🥞', '🥓', '🥩', '🍗', '🍖', '🌭', '🍔', '🍟', '🍕', '🥪', '🥙', '🌮', '🌯', '🥗', '🥘', '🥫', '🍝', '🍜', '🍲', '🍛', '🍣', '🍱', '🥟', '🍤', '🍙', '🍚', '🍘', '🍥', '🥠', '🍢', '🍡', '🍧', '🍨', '🍦', '🥧', '🍰', '🎂', '🍮', '🍭', '🍬', '🍫', '🍿', '🧂', '🍩', '🍪', '🌰', '🥜', '🍯', '🥛', '🍼', '☕', '🍵', '🍶', '🍾', '🍷', '🍸', '🍹', '🍺', '🍻', '🥂', '🥃', '🥤', '🧃', '🧉', '🧊', '🥢', '🍽️', '🍴', '🥄',] },
        { category: 'Activity ⚽', emojis: ['⚽', '🏀', '🏈', '⚾', '🥎', '🎾', '🏐', '🏉', '🥏', '🎱', '🏓', '🏸', '🥅', '🏒', '🏑', '🥍', '🏏', '🥊', '🥋', '⛸️', '🎣', '🤿', '🥇', '🥈', '🥉', '🏆', '🏅', '🎖️', '🏵️', '🎗️', '🎫', '🎟️', '🎪', '🤹‍♂️', '🤹‍♀️', '🎭', '🎨', '🧶', '🎼', '🎤', '🎧', '🎷', '🎸', '🎹', '🎺', '🎻', '🥁', '🎬', '🎮', '👾', '🎯', '🎲', '🧩', '🎳', '🎮', '🎰'] },
        { category: 'Travel 🚗', emojis: ['🚗', '🚕', '🚙', '🚌', '🚎', '🏎️', '🚓', '🚑', '🚒', '🚐', '🚚', '🚛', '🚜', '🛴', '🚲', '🛵', '🏍️', '🛺', '🚨', '🚔', '🚍', '🚘', '🚖', '🚡', '🚠', '🚟', '🚃', '🚋', '🚞', '🚝', '🚄', '🚅', '🚈', '🚂', '🚆', '🚇', '🚊', '🚉', '🚁', '🛩️', '✈️', '🛫', '🛬', '🪂', '💺', '🚀', '🛸', '🌍', '🌎', '🌏', '🌐', '🗺️', '🗾', '🧭', '🏔️', '⛰️', '🌋', '🗻', '🏕️', '🏖️', '🏜️', '🏝️', '🏞️', '🏟️', '🏛️', '🏗️', '🧱', '🏘️', '🏚️', '🏠', '🏡', '🏢', '🏣', '🏤', '🏥', '🏦', '🏨', '🏩', '🏪', '🏫', '🏬', '🏭', '🏯', '🏰',] },
        { category: 'Objects 💡', emojis: ['⌚', '📱', '📲', '💻', '⌨️', '🖥️', '🖨️', '🖱️', '🖲️', '🕹️', '🗜️', '💽', '💾', '💿', '📀', '📼', '📷', '📸', '📹', '🎥', '📽️', '🎞️', '📞', '☎️', '📟', '📠', '📺', '📻', '🎙️', '🎚️', '🎛️', '⏱️', '⏲️', '⏰', '🕰️', '⌛', '⏳', '📡', '🔋', '🔌', '💡', '🔦', '🕯️', '🪔', '🧯', '🛢️', '💸', '💵', '💴', '💶', '💷', '💰', '💳', '💎', '⚖️', '🪙', '🧰', '🔧', '🔨', '⚒️', '🛠️', '⛏️', '🔩', '⚙️', '🪛', '🔫', '💣', '🔪', '🗡️', '🛡️', '🚬', '⚰️', '⚱️', '🏺', '🔮', '📿', '💈', '💉', '💊', '🩸', '🩹', '🩺', '🚽', '🚿', '🛁', '🪒', '🧴', '🧷', '🧹', '🧺', '🧻', '🧼', '🧽', '🧯', '🛒', '🚬', '🔒', '🔓', '🔏', '🔐', '🔑', '🗝️', '🚪', '🛋️', '🛏️', '🛌', '🖼️', '🛍️', '🧳', '🛒', '🎒', '🧢', '📿', '💄', '💍', '💼', '🩰', '🩴', '👓', '🕶️', '🥽', '🥼', '🦺', '👔', '👕', '👖', '🧣', '🧤', '🧥', '🧦', '👗', '👘', '🥻', '🩱', '🩲', '🩳', '👙', '👚', '👛', '👜', '👝', '🎒', '👞', '👟', '🥾', '🥿', '👠', '👡', '🩰', '👢', '👑', '👒', '🎩', '🎓', '🧢', '⛑️', '💄', '💍', '🌂',] },
        { category: 'Symbols 🔣', emojis: ['❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '💔', '❣️', '💕', '💞', '💓', '💗', '💖', '💘', '💝', '💟', '☮️', '✝️', '☪️', '🕉️', '☸️', '✡️', '🔯', '🕎', '☯️', '☦️', '🛐', '⛎', '♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓', '🆔', '⚛️', '🉑', '☢️', '☣️', '📴', '📳', '🈶', '🈚', '🈸', '🈺', '🈷️', '✴️', '🆚', '🉐', '💮', '🉑', '⭕', '✅', '☑️', '✔️', '❌', '❎', '➕', '➖', '➗', '➰', '➿', '〽️', '✳️', '✴️', '❇️', '‼️', '⁉️', '❓', '❔', '❕', '❗', '〰️', '©️', '®️', '™️', '🔟', '🔠', '🔡', '🔢', '🔣', '🔤', '🅰️', '🆎', '🅱️', '🆑', '🆒', '🆓', 'ℹ️', '🆔', 'Ⓜ️', '🆕', '🆖', '🅾️', '🆗', '🅿️', '🆘', '🆙', '🆚', '🈁', '🈂️', '🈷️', '🈶', '🈯', '🉐', '🈹', '🈚', '🈲', '🉑', '🈸', '🈴', '🈳', '㊗️', '㊙️', '🈺', '🈵', '🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '🟤', '⚫', '⚪', '🟥', '🟧', '🟨', '🟩', '🟦', '🟪', '🟫', '⬛', '⬜', '◼️', '◻️', '◾', '◽', '▪️', '▫️', '🔶', '🔷', '🔸', '🔹'] },
    ];

    return (
        <div className="chat-container">
            <div className="chat-box" ref={chatBoxRef}>
                {messages.map((message, index) => (
                    <div key={index} className={`message-bubble ${message.sender === 'sender1' ? 'left' : 'right'}`}
                        onContextMenu={(event) => handleContextMenu(event, message)}>
                        {message.type === 'audio' ? (
                            <audio controls src={message.content} />
                        ) : (
                            message.content
                        )}
                        {message.fileUrl && (
                            <div className="file-preview">
                                {message.fileType.startsWith('image') && <img src={message.fileUrl} alt="Sent" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
                                {message.fileType.startsWith('audio') && <audio controls src={message.fileUrl} />}
                                {message.fileType.startsWith('video') && <video controls style={{ maxWidth: '100px', maxHeight: '100px' }} src={message.fileUrl} />}
                                {message.fileType === 'application/pdf' && <embed src={message.fileUrl} width="100px" height="100px" type="application/pdf" />}
                                {['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(message.fileType) && (
                                    <div className="document-preview">
                                        {getFileIcon(message.fileType)} {message.fileName}
                                        <a href={message.fileUrl} download><span role="img" aria-label="download">⬇️</span></a>
                                    </div>
                                )}
                            </div>
                        )}
                    <div className="message-content">
                    </div>
                        <span className="message-timestamp">{message.timestamp}</span> {/* Add timestamp here */}
                    </div>
               ))}
               {contextMenu && (
                <div
                    className="context-menu"
                    style={{
                        top: contextMenu.mouseY,
                        left: contextMenu.mouseX,
                    }}
                >
                    <button onClick={handleCopy}>Copy</button>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
            </div>
            <div className="user-input">
            <button onClick={toggleEmojiPicker}>
                <span role="img" aria-label="emoji">😀</span>
            </button>
                <input
                type="file"
                id="file-input"
                accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                ref={fileInputRef}
            />
            <button onClick={() => document.getElementById('file-input').click()}>
                <span role="img" aria-label="upload image">📷</span>
            </button>
            {fileUrl && (
                <div className="file-preview">
                    {fileType.startsWith('image') && <img src={fileUrl} alt="Selected" style={{ maxWidth: '100px', maxHeight: '100px' }} />}
                    {fileType.startsWith('audio') && <audio controls src={fileUrl} />}
                    {fileType.startsWith('video') && <video controls style={{ maxWidth: '100px', maxHeight: '100px' }} src={fileUrl} />}
                    {fileType === 'application/pdf' && <embed src={fileUrl} width="100px" height="100px" type="application/pdf" />}
                    {['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-powerpoint', 'application/vnd.openxmlformats-officedocument.presentationml.presentation'].includes(fileType) && (
                        <div className="document-preview">
                            {getFileIcon(fileType)} {fileName}
                        </div>
                    )}
                </div>
            )}
                <input
                    type="text"
                    id="message-input"
                    placeholder="Type your message..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <div className="recording-controls">
                    {isRecording && (
                        <div className="recording-bar">
                            <span className="recording-timer">{formatTime(recordingTime)}</span>
                            <button onClick={handlePauseResumeClick}>
                                {isPaused ? '▶' : <i class="fa fa-pause"></i>}
                            </button> 
                        </div>
                    )}
                    <button onClick={handleMicrophoneClick}>
                    {isRecording ? <img src={require("./send.png")} alt="Send" style={{ transform: 'scale(1.5)', transition: 'transform 0.2s ease-in-out', width: '33px', height: '26px' }}/> : <img src={require("./mic.png")} alt="Start recording" style={{ transform: 'scale(1.5)', transition: 'transform 0.2s ease-in-out', width: '33px', height: '26px' }}/>}
                    </button>
                </div>
                <button onClick={handleSendClick} ref={sendButtonRef} >Send</button>
            </div>
            {showEmojiPicker && (
                <div className="emoji-picker">
                    <div className="emoji-header">
                        {emojis.map((category, index) => (
                            <button
                                key={index}
                                className={`emoji-category-btn ${selectedCategory === index ? 'active' : ''}`}
                                onClick={() => setSelectedCategory(selectedCategory === index ? null : index)}
                            >
                                {category.category}
                            </button>
                        ))}
                    </div>
                    <div className="emoji-panel">
                        {selectedCategory !== null && (
                            <div className="emoji-list">
                                {emojis[selectedCategory].emojis.map((emoji, idx) => (
                                    <span key={idx} onClick={() => handleEmojiClick(emoji)}>{emoji}</span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Chat;
