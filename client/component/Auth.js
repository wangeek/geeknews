import React from 'react';
import Button from 'material-ui/Button';
import TextField from 'material-ui/TextField';
import Tabs, { Tab } from 'material-ui/Tabs';
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
} from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import Snackbar from 'material-ui/Snackbar';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import Tooltip from 'material-ui/Tooltip';
import axios from "axios";
import Add from "./Add"

class Auth extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            // 0 for login, 1 for signup.
            form_type:0,
            email: null, 
            password: null,
            error: null,
            token: localStorage.getItem('token') || null,
            show_snack:false
        };
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFormType = this.handleFormType.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleClickOpen() {
        this.setState({ open: true });
    };

    handleClose() {
        //reset state
        this.setState({ 
            open: false,
            form_type:0,
            error: null
         });
    };

    handleFormType(event, value) {
        this.setState({ form_type: value });
    }

    _call_login( email, password ){
        axios.post('/api/writers/login',
            {
                email: email,
                password: password,
                headers: { 'Content-Type': 'application/json' },
                validateStatus: function (status) {
                    return status < 500;
                }
            }
        ).then(
            response => {
                console.log(response);
                this.setState({
                    token: response.data.id
                });
                localStorage.setItem('token', response.data.id);
                localStorage.setItem('userId', response.data.userId)
            }
        ).catch(error => {
            console.log('Error', error.response);
            if (error.response.data.error.statusCode === 401) {
                this.setState({
                    error: "Wrong Email & assword!" 
                })
            }
        });
    }

    _call_singup( email, password ){
        axios.post("/api/writers",
            {
                email: email,
                password: password,
                headers: { 'Content-Type': 'application/json' },
                validateStatus: function (status) {
                    return status < 500;
                }
            }
        ).then(
            response => {
                console.log(response);
                // close the dialog.
                this.setState({
                    open: false,
                    show_snack: true
                 });
            }
        ).catch(error => {
            console.log('Error', error.response);
            if (error.response.data.error.statusCode === 422) {
                this.setState({
                    error:  "Email already exists!"
                })
            }
        });
    }

    handleSubmit() {
        const { email, password } = this.state;
        if ( ! (email && password)) {
            this.setState({
                error: "Form invalid!"
            })
        }else{
            this.state.form_type === 0 ? this._call_login(email, password): this._call_singup(email, password)
        }
    };

    handleLogout(){
        axios.post("api/writers/logout?access_token=" + this.state.token,
        {
            access_token: this.state.token,
            headers: { 'Content-Type': 'application/json' },
            validateStatus: function (status) {
                return status < 500;
            }
        }
        ).then(
        response => {
            console.log(response);
        }
        ).catch(error => {
            console.log('Error', error.response);
        });
        // forch layout anyway.
        this.setState({
            token: null
        });
        localStorage.removeItem('token');
    }

    _authed_render() {
        return <div>
            <Add/>
            <Tooltip id="tooltip-icon" title="Logout">
                <IconButton color="secondary" aria-label="Logout" onClick={this.handleLogout}>
                    <Icon>power_settings_new</Icon>
                </IconButton>
            </Tooltip>
        </div>
    }

    _unauthed_render() {
        return <div>
            <Tooltip id="tooltip-icon" title="Login">
                <IconButton aria-label="Login"  onClick={this.handleClickOpen}>
                <Icon>account_circle</Icon>
                </IconButton>
            </Tooltip>
            <Dialog
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    <Tabs
                        value={this.state.form_type}
                        onChange={this.handleFormType}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                            >
                        <Tab label="Log in" />
                        <Tab label="Sign up" />
                    </Tabs>
                </DialogTitle>
                <DialogContent>
                    <Typography color="error" >
                        {this.state.error}
                    </Typography>
                    <TextField
                        margin="dense"
                        id="email"
                        label="Email"
                        type="email"
                        onChange={e => this.setState({ email: e.target.value })}
                        fullWidth
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        onChange={e => this.setState({ password: e.target.value })}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">Cancel</Button>
                    <Button onClick={this.handleSubmit} color="primary">OK</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                open={ this.state.show_snack }
                onClose={()=>{ this.setState({ show_snack: false }) }}
                SnackbarContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">User Created!</span>}
                />
        </div>
    }

    render() {
        return (
            this.state.token ? this._authed_render() : this._unauthed_render()
        );
    }
}

export default Auth; 