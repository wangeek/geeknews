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
import { withRouter } from 'react-router-dom';


class Reply extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false,
            content: null,
            error: null,
            show_snack:false
        };
        this.handleClickOpen = this.handleClickOpen.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleAddStory = this.handleAddStory.bind(this);
    }

    handleClickOpen() {
        this.setState({ open: true });
    };

    handleClose() {
        //reset state
        this.setState({ 
            open: false,
            error: null
         });
    };

    handleAddStory() {
        const { story_id } = this.props;
        const { content } = this.state;
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if ( ! (story_id && content)) {
            this.setState({
                error: "Form invalid!"
            })
        }else{
            axios.post("/api/comments?access_token="+token,
                {
                    story_id: story_id,
                    content: content,
                    writer_id:userId,
                    create_on:Date(),
                    headers: { 'Content-Type': 'application/json' },
                }
            ).then(
                response => {
                    console.log(response);
                    // close the dialog.
                    this.setState({
                        open: false,
                        show_snack: true
                    });
                    // due to react router hash history bug, have to reload this page.
                    // this.props.history.push("/stories/"+story_id);
                    location.reload();
                }
            ).catch(error => {
                console.log('Error', error);
            });
        }
    }

    render() {
        const Fragment = React.Fragment;
        return (
            <Fragment>
            <Tooltip id="tooltip-icon" title="Comment">
      <Button variant="fab" mini  color="secondary" aria-label="Comment" onClick={() => this.handleClickOpen()}>
              <Icon>comment</Icon>
      </Button>
</Tooltip>
            <Dialog
                maxWidth="md"
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">
                    Post A Comment
                </DialogTitle>
                <DialogContent>
                    <Typography color="error" >
                        {this.state.error}
                    </Typography>
                    <TextField
                        margin="normal"
                        id="content"
                        label="Content"
                        multiline
                        rows="2"
                        onChange={e => this.setState({ content: e.target.value })}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={this.handleClose} color="primary">Cancel</Button>
                    <Button onClick={this.handleAddStory} color="primary">OK</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                anchorOrigin={{vertical: 'top', horizontal: 'right'}}
                open={ this.state.show_snack }
                onClose={()=>{ this.setState({ show_snack: false }) }}
                SnackbarContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">Comment Added!</span>}
                />
            </Fragment>
            )
    }

}

export default withRouter(Reply); 