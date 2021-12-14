// Note: ResetPassword component...!

import React, { useState } from 'react';
import {
    Button,
    Grid,
    IconButton,
    Paper,
    Typography,
    FormControl,
    Input,
    InputLabel,
    InputAdornment,
    useTheme,
    useMediaQuery,
    makeStyles
} from '@material-ui/core';
import { Email, Visibility, VisibilityOff } from '@material-ui/icons';
import "./style.css";
import axios from "axios";
import swal from 'sweetalert';
import LockIcon from "./assets/lock.png";

// Note: Handeling Material UI styling here...!
const useStyle = makeStyles((theme) => ({
    Paper: {
        width: '520px',
        [theme.breakpoints.down('sm')]: {
            width: "auto"
        },
        color: '#f6f6f6',
        borderRadius: '17px',
        padding: '2em',
        backgroundColor: "white"
    },

    Heading: {
        marginTop: '1em',
        fontSize: '1.3em',
        fontFamily: 'sans-serif',
        color: `#212943`,
    },

    Link: {
        textDecoration: 'none'
    },

    linkText: {
        fontSize: 14
    },

    Button: {
        borderRadius: '20px',
        padding: '13px',
        backgroundColor: `#299371`,
        color: '#fff',
        '&:hover': {
            backgroundColor: '#4CD3A8',
        },
    }
}));

const ResetPassword = () => {

    // Note: To access Material UI...!
    const classes = useStyle();

    // Note: To control responsiveness...!
    const theme = useTheme();
    const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));
    const matchesXS = useMediaQuery(theme.breakpoints.down('xs'));

    // Note: Handeling states here...!
    const [formData, setformData] = useState({
        email: '',
        password: '',
        confirmPassword: ''
    });

    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [enablePassword, setEnablePassword] = useState(false);
    const [enableConfirmPassword, setEnableConfirmPassword] = useState(false);

    const { email, password, confirmPassword } = formData;

    // Note: Function to handle form...!
    const onChange = (e) => {
        setformData({ ...formData, [e.target.name]: e.target.value });
    };

    // Note: Function to submit form data...!
    const onSubmit = () => {

        let validEmailFormat = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (!email.match(validEmailFormat)) {
            swal({
                title: "Invalid Email Address",
                text: "Email is Required or Inavlid Email Format",
                icon: "error",
                button: "Try Again",
            });
        }

        else if (password.length < 6) {
            swal({
                title: "Error Occured",
                text: "Password is Required or Password length should be greater than six!",
                icon: "error",
                button: "Try Again",
            });
        }

        else if (password != confirmPassword) {
            swal({
                title: "Error Occured",
                text: "Confirm password should be same as password!",
                icon: "error",
                button: "Try Again",
            });
        }

        else {
            // console.log(formData);
            resetPassword(formData)
            clearAll();
        }
    };

    // Note: Function to clear all input fields...!
    const clearAll = () => {
        setformData({
            email: '',
            password: '',
            confirmPassword: ''
        });
    }

    /***** Note: Function to reset password through API *****/
    const resetPassword = async (data) => {
        // console.log(data, 'Form data recieved!');
        setIsButtonDisabled(true);

        let formObj = {
            email: data.email,
            newpassword: data.password,
            confirmpassword: data.confirmPassword
        }
        console.log(formObj);

        let { email, newpassword, confirmpassword } = formObj;
        let api = `https://crm.shaker.com.sa/api/customers/SubmitEmailPasswordUpdate?email_no=${email}&newpassword=${newpassword}&confirmpassword=${confirmpassword}`;

        try {
            let response = await axios.post(api);
            console.log(response);

            if (response.data.message === "Password Update Succesfully") {
                swal({
                    title: "Password Updated",
                    text: "Your password has been updated succesfully",
                    icon: "success",
                    button: "Ok!",
                });
                setIsButtonDisabled(false);
            }
        }

        catch (error) {
            console.log(error.message);
            setIsButtonDisabled(false);
        }
    }

    /***** Note: UI *****/
    return (
        <div id="custom-body">
            <Grid item container style={{ display: "flex", justifyContent: "center" }}>
                <Grid item container component={Paper} elevation={3} className={classes.Paper} justify='center' alignItems='center'>

                    {/* Note: Logo container */}
                    <Grid item container justify='center'>
                        <img
                            alt="Lock-Icon"
                            src={LockIcon}
                            style={{
                                objectFit: "contain",
                                resize: "horizontal"
                            }}
                        />
                    </Grid>

                    {/* Note: Header */}
                    <Grid item container justify='center' className={classes.Heading}>
                        <Typography variant={(matchesSM || matchesXS) ? ('h5') : ('h4')} style={{ textAlign: "center" }}>
                            Enter New Password
                        </Typography>
                    </Grid>

                    <Grid item container direction='row' justify='center' alignItems='center' style={{ marginTop: '2em' }}>

                        {/* Note: Email field container */}
                        <FormControl fullWidth sx={{ m: 1 }} variant="standard">
                            <InputLabel htmlFor="standard-adornment-password">Email</InputLabel>
                            <Input
                                id="standard-adornment-password"
                                type="email"
                                name="email"
                                inputProps={{
                                    style: {
                                        fontSize: '1.1rem',
                                        color: "black"
                                    },
                                }}
                                value={email || ""}
                                onChange={onChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton aria-label="toggle password visibility">
                                            <Email />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>

                        {/* Note: Password field container */}
                        <FormControl fullWidth sx={{ m: 1 }} variant="standard" style={{ marginTop: '0.5em' }}>
                            <InputLabel htmlFor="standard-adornment-password">Password</InputLabel>
                            <Input
                                id="standard-adornment-password"
                                type={enablePassword ? 'text' : 'password'}
                                name="password"
                                inputProps={{
                                    style: {
                                        fontSize: '1.1rem',
                                        color: "black"
                                    },
                                }}
                                value={password || ""}
                                onChange={onChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setEnablePassword(!enablePassword)}
                                        >
                                            {enablePassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>

                        {/* Note: Confirm password field container */}
                        <FormControl fullWidth sx={{ m: 1 }} variant="standard" style={{ marginTop: '0.5em' }}>
                            <InputLabel htmlFor="standard-adornment-password">Confirm Password</InputLabel>
                            <Input
                                id="standard-adornment-password"
                                type={enableConfirmPassword ? 'text' : 'password'}
                                name='confirmPassword'
                                inputProps={{
                                    style: {
                                        fontSize: '1.1rem',
                                        color: "black"
                                    },
                                }}
                                value={confirmPassword || ""}
                                onChange={onChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => setEnableConfirmPassword(!enableConfirmPassword)}
                                        >
                                            {enableConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>

                        {/* Note: Submit button field container */}
                        <Grid item container justify='center' style={{ marginTop: '2em' }}>
                            <Button
                                onClick={onSubmit}
                                fullWidth
                                variant='contained'
                                className={classes.Button}
                                disabled={(isButtonDisabled) ? (true) : (false)}
                            >
                                Submit
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}

export default ResetPassword;