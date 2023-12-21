import React, { useState, useRef, useEffect } from 'react';
import { Paper, TextField, IconButton, Modal, Box, Typography, Tooltip } from '@mui/material';
import { IoMdSend } from 'react-icons/io';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import SendIcon from '@mui/icons-material/Send';
import axios from 'axios';
import { uploadAudioRoute } from '../../api/Routes'
import InputBase from '@mui/material/InputBase';


function useOutsideAlerter(ref, onOutsideClick) {
    useEffect(() => {
        function handleClickOutside(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                onOutsideClick();
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [ref, onOutsideClick]);
}

export default function ChatInput({ chatType, handleSendMsg, currentChat, currentUser }) {
    const [msg, setMsg] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [audioData, setAudioData] = useState(null);
    const [recordingDuration, setRecordingDuration] = useState(0);
    const [volume, setVolume] = useState(0);
    const [canSend, setCanSend] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const mediaRecorderRef = useRef(null);
    const recordingIntervalRef = useRef(null);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const modalRef = useRef(null);
    useOutsideAlerter(modalRef, () => {
        if (isRecording) {
            stopRecording();
        }
    });

    const sendMsg = async (event) => {
        event.preventDefault();
        if (msg.length > 0) {
            handleSendMsg({ type: 'text', content: msg });
            setMsg('');
        } else if (audioData) {
            const formData = new FormData();
            formData.append('audio', audioData, `voice_message.mp3`);
            formData.append('from', currentUser._id);
            formData.append('to', currentChat._id);
            formData.append('duration', Math.ceil(recordingDuration));

            const audioUrl = await sendAudioMessage(formData);
            if (audioUrl) {
                handleSendMsg({
                    type: 'voice',
                    content: 'voice message',
                    duration: Math.ceil(recordingDuration),
                    audioUrl: audioUrl
                });
            } else {
                console.error('Audio URL is undefined');
            }
            setAudioData(null);
            setRecordingDuration(0);
        }
    }

    const sendAudioMessage = async (formData) => {
        try {
            const response = await axios.post(uploadAudioRoute, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return response.data.data.audioUrl;

        } catch (error) {
            console.error('Error uploading audio message', error);
            return null;
        }
    }

    const sendVoiceMessage = async () => {
        if (audioData) {
            const formData = new FormData();
            formData.append('audio', audioData, `voice_message.mp3`);
            formData.append('from', currentUser._id);
            formData.append('to', currentChat._id);
            formData.append('duration', Math.ceil(recordingDuration));

            const audioUrl = await sendAudioMessage(formData);
            console.log(audioUrl)
            handleSendMsg({ type: 'voice', content: 'voice message', duration: Math.ceil(recordingDuration), audioUrl: audioUrl });

            // Reset states
            setAudioData(null);
            setRecordingDuration(0);
            setCanSend(false);
        }
    };

    const startRecording = async () => {
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const source = audioContextRef.current.createMediaStreamSource(stream);
            const analyser = audioContextRef.current.createAnalyser();
            analyser.fftSize = 2048;
            source.connect(analyser);
            analyserRef.current = analyser;

            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.start();

            setIsRecording(true);
            setRecordingDuration(0);
            setOpenModal(true);
            recordingIntervalRef.current = setInterval(() => {
                setRecordingDuration(prev => prev + 1);
                updateVolume();
            }, 1000);

            const audioChunks = [];
            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunks.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunks);
                setAudioData(audioBlob);
            };
        }
    };

    const stopRecording = () => {
        mediaRecorderRef.current.stop();
        clearInterval(recordingIntervalRef.current);
        setIsRecording(false);
        setCanSend(true); // Enable send button
        // Do not close the modal here
        setVolume(0);
        if (audioContextRef.current) {
            audioContextRef.current.close();
            audioContextRef.current = null;
        }
    };

    const updateVolume = () => {
        if (!analyserRef.current) return;
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
        }
        let average = sum / dataArray.length;
        setVolume(average);
    };

    return (
            <Paper elevation={5} variant="outlined" sx={{
                width:"100%",
                display: 'flex',
                margin: 0,
                height: "auto",
                alignItems: 'center',
                borderRadius: '20px',
                boxShadow: 'black',
                borderColor: 'rgba(0, 0, 0, 0.23)',
                padding: '8px',
                '&:hover': {
                    borderColor: 'black',
                },
            }}>
                {chatType === "DM" && (
                    <IconButton onClick={startRecording} disabled={isRecording} sx={{ color: 'black' }}>
                        <MicIcon style={{ fontSize: '1.2em' }} />
                    </IconButton>)}
                <form onSubmit={sendMsg} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <TextField
                        fullWidth
                        InputProps={{
                            // Here, we customize the InputBase component to hide the border
                            component: InputBase,
                            style: { border: 'none' },
                          }}
                        variant="outlined"
                        placeholder='Type your message here'
                        value={msg}
                        onChange={(e) => setMsg(e.target.value)}
                        sx={{ input: { color: 'black' }, mr: 1, border:"none" }}
                        disabled={isRecording}
                    />
                    <IconButton type='submit' color="primary" sx={{ p: 0 }}>
                        <IoMdSend style={{ fontSize: '1.2em' }} />
                    </IconButton>
                </form>
            <Modal
                open={openModal}
                onClose={() => {
                    if (!isRecording) {
                        setOpenModal(false);
                    }
                }}
                aria-labelledby="recording-modal-title"
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <Box
                    ref={modalRef}
                    sx={{
                        position: 'relative',
                        width: 300,
                        bgcolor: 'background.paper',
                        borderRadius: '10px',
                        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                        p: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2
                    }}
                >
                    <Typography id="recording-modal-title" variant="h6" component="h2">
                        Recording... Volume: {Math.round(volume)}
                    </Typography>
                    <Box sx={{ justifyContent: "space-between" }}>
                        <Tooltip title="Stop Recording" placement="top">
                            <IconButton onClick={stopRecording} disabled={!isRecording} sx={{ color: 'black' }} aria-label="stop recording">
                                <MicOffIcon style={{ fontSize: '1.5em' }} />
                            </IconButton>
                        </Tooltip>

                        <Tooltip title="Send Voice Message" placement="top">
                            <IconButton onClick={sendVoiceMessage} disabled={!canSend} sx={{ color: 'black' }} aria-label="send voice message">
                                <SendIcon style={{ fontSize: '1.5em' }} />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </Box>
            </Modal>
            </Paper>
    );
}
