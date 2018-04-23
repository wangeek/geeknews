import classNames from 'classnames';
import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import List, { ListItem, ListItemText } from 'material-ui/List';
import Paper from 'material-ui/Paper';
import axios from "axios";
import { withRouter } from 'react-router-dom';

const styles = theme => ({
    root: theme.mixins.gutters({
        paddingTop: 16,
        paddingBottom: 16,
        marginTop: theme.spacing.unit * 3,
    }),
});

class StoryList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            stories: [],
        };
    }

    componentDidMount() {
        axios.get("api/stories/",
            { headers: { 'Content-Type': 'application/json' } }
        )
            .then(
                res => res.data
            )
            .then(
                (result) => {
                    // console.log(result);
                    this.setState({
                        stories: result
                    });
                },
                (error) => {
                    console.log(error)
                });
        // this.setState(this.store.getState())

    }

    render() {
        const { classes } = this.props;

        return (
            <Paper className={classes.root}>
                <List>
                    {
                        this.state.stories.map((story) =>
                            <ListItem button
                                key={story.id}
                                onClick={() => this.props.history.push("/stories/"+story.id)}
                            >
                                <ListItemText primary={story.title} secondary={story.create_on} />
                            </ListItem>
                        )
                    }
                </List>
            </Paper>
        );
    }
}

StoryList.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withRouter(withStyles(styles)(StoryList));