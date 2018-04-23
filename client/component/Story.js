import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Toolbar from 'material-ui/Toolbar';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import Icon from 'material-ui/Icon';
import List, { ListItem, ListItemText } from 'material-ui/List';
import axios from "axios";
import Reply from "./Reply";
// import { withRouter } from 'react-router-dom';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 16,
    paddingBottom: 16,
    marginTop: theme.spacing.unit * 3,
  }),
  flex: {
    flex: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
});

class Story extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      story: {},
      comments:[]
    };
    this.handleDelete = this.handleDelete.bind(this)
  }

  componentDidMount() {
    let endpoint = "api/stories/" + this.props.match.params.id;
    axios.get(endpoint,
      { headers: { 'Content-Type': 'application/json' } }
    )
      .then(
        res => res.data
      )
      .then(
        (result) => {
          console.log(result);
          this.setState({
            story: result
          });
        },
        (error) => {
          console.log(error)
        });
    // this.setState(this.store.getState())
    endpoint += "/comments/";
    axios.get(endpoint,
      { headers: { 'Content-Type': 'application/json' } }
    )
      .then(
        res => res.data
      )
      .then(
        (result) => {
          console.log(result);
          this.setState({
            comments: result
          });
        },
        (error) => {
          console.log(error)
        });
  }

  handleDelete(){
    const endpoint = "/api/stories/"+this.state.story.id;
    const token = localStorage.getItem('token');
    axios.delete(endpoint +"/?access_token="+token,
                {
                  access_token: token,
                    headers: { 'Content-Type': 'application/json' },
                    validateStatus: function (status) {
                        return status < 500;
                    }
                }
            ).then(
                response => {
                    console.log(response);
                    this.props.history.goBack()
                }
            ).catch(error => {
                console.log('Error', error.response);
                // if (error.response.data.error.statusCode === 422) {
                //     this.setState({
                //         error:  "Email already exists!"
                //     })
                // }
            });
  }

  render() {
    const { classes } = this.props;
    let token = localStorage.getItem('token');
    let userId = localStorage.getItem('userId');
    // story owner can delete
    const _render_delete = () =>{
      let elm = null;
      if (token && String(this.state.story.writer_id) === userId){
        elm =  <Tooltip id="tooltip-icon" title="Delete">
          <Button variant="fab" mini className={classes.menuButton} aria-label="Delete" onClick={this.handleDelete}>
                  <Icon>delete</Icon>
          </Button>
          </Tooltip>
      }
      return elm
    };
    // authed user can post comment
    const _render_reply = () =>{
      let elm = null;
      if (token){
        elm = <Tooltip id="tooltip-icon" title="Comment">
      <Button variant="fab" mini  color="secondary" aria-label="Comment" onClick={() => this.props.history.goBack()}>
              <Icon>comment</Icon>
      </Button>
</Tooltip>
      }
      return elm
    }
    // render comments
    const _render_comments = () =>{
      return   <Paper className={classes.root}>
                <Typography variant="title" component="h3">
          Comments:
        </Typography>
      <List>
          {
              this.state.comments.map((comment) =>
                  <ListItem key={comment.id} >
                      <ListItemText primary={comment.content} 
                        secondary={comment.create_on} 
                        />
                  </ListItem>
              )
          }
      </List>
  </Paper>
    }
    
    return (
      <div>
      <Paper className={classes.root} elevation={4}>
        <Toolbar className={classes.flex}>
          <Tooltip id="tooltip-icon" title="Back">
                  <Button  variant="fab" mini className={classes.menuButton} aria-label="Back" onClick={() => this.props.history.goBack()}>
                          <Icon>chevron_left</Icon>
                  </Button>
          </Tooltip>
          <Typography variant="headline" color="inherit" className={classes.flex}>
          {this.state.story.title}
          </Typography>
          {_render_delete()}
          <Reply story_id ={this.state.story.id} />
        </Toolbar>
        <Typography component="p" className={classes.root}>
          {this.state.story.content}
        </Typography>
      </Paper>

      { this.state.comments ? _render_comments() : null }
      </div>
    );
  }
}

Story.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Story);