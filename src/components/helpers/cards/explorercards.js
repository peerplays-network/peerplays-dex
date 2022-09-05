import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import counterpart from 'counterpart';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    textAlign: 'center',

  },
  paper: {
    padding: theme.spacing(2),
    textAlign: 'center',
    '& div': {
      fontSize: '1.75rem',
      overflowWrap: 'break-word' 
    }
  }
}));

export default function Explorercards(props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>
        <Grid item xs={6} md={2}>
          <Card className="explorer__cards">
            <CardContent className={classes.paper}>
              <Typography component="h5" variant="h4">
                <div>{counterpart.translate(`blockchain.blockchain.current_block`)}</div>
              </Typography>
              <Typography variant="h5" color="textSecondary">
                {props.head_block_number}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card className="explorer__cards">
            <CardContent className={classes.paper}>
              <Typography component="h5" variant="h4">
                <div>{counterpart.translate(`blockchain.blockchain.supply`, {currency: props.coreAsset.symbol})}</div>
              </Typography>
              <Typography variant="h5" color="textSecondary">
                {props.current_supply}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card className="explorer__cards">
            <CardContent className={classes.paper}>
              <Typography component="h5" variant="h4">
                <div>{counterpart.translate(`blockchain.blockchain.active_witnesses`)}</div>
              </Typography>
              <Typography variant="h5" color="textSecondary">
                {props.active_witnesses.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card className="explorer__cards">
            <CardContent className={classes.paper}>
              <Typography component="h5" variant="h4">
                <div>{counterpart.translate(`blockchain.blockchain.confirmation_time`)}</div>
              </Typography>
              <Typography variant="h5" color="textSecondary">
                {props.avgTime.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card className="explorer__cards">
            <CardContent className={classes.paper}>
              <Typography component="h5" variant="h4">
                <div>{counterpart.translate(`blockchain.blockchain.last_irreversible`)}</div>
              </Typography>
              <Typography variant="h5" color="textSecondary">
                {props.last_irreversible_block_num}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6} md={2}>
          <Card className="explorer__cards">
            <CardContent className={classes.paper}>
              <Typography component="h5" variant="h4">
                <div>{counterpart.translate(`blockchain.blockchain.stealth_supply`, {currency: props.coreAsset.symbol})}</div>
              </Typography>
              <Typography variant="h5" color="textSecondary">
                {props.confidential_supply}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
