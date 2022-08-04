import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Translate from "react-translate-component";
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import {formDate} from "../../../actions/formDate";

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
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

export default function Witnesscards(props) {
    const classes = useStyles();
    const { active, blockchainData, currentWitness } = props;

    let nextMaintenanceTime = '';
    if (blockchainData) nextMaintenanceTime = formDate(blockchainData.next_maintenance_time, ['date', 'month', 'year', 'time']);

    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={6} sm={2}>
                    <Card className="witness__cards">
                        <CardContent className={classes.paper}>
                            <Typography component="h5" variant="h4">
                                <Translate component="div" content={"blockchain.blockchain.active_witnesses"} />
                            </Typography>
                            <Typography variant="h5" color="textSecondary">
                                {active.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={6} sm={2}>
                    {currentWitness && <Card className="witness__cards">
                        <CardContent className={classes.paper}>
                            <Typography component="h5" variant="h4">
                                <Translate component="div" content={"blockchain.witnesses.currentWitness"} />
                            </Typography>
                            <Typography variant="h5" color="textSecondary">
                                {currentWitness.name}
                            </Typography>
                        </CardContent>
                    </Card>}
                </Grid>
                <Grid item xs={6} sm={2}>
                    {currentWitness && <Card className="witness__cards">
                        <CardContent className={classes.paper}>
                            <Typography component="h5" variant="h4">
                                <Translate component="div" content={"blockchain.witnesses.totalMissed"} />
                            </Typography>
                            <Typography variant="h5" color="textSecondary">
                                {currentWitness.total_missed}
                            </Typography>
                        </CardContent>
                    </Card>}
                </Grid>
                <Grid item xs={6} sm={3}>
                    {blockchainData && <Card className="witness__cards">
                        <CardContent className={classes.paper}>
                            <Typography component="h5" variant="h4">
                                <Translate component="div" content={"blockchain.witnesses.remainingBudget"} with={{ currency: blockchainData.coreAsset.symbol }} />
                            </Typography>
                            <Typography variant="h5" color="textSecondary">
                                {blockchainData.witness_budget}
                            </Typography>
                        </CardContent>
                    </Card>}
                </Grid>
                <Grid item xs={12} sm={3}>
                    {blockchainData && <Card className="witness__cards">
                        <CardContent className={classes.paper}>
                            <Typography component="h5" variant="h4">
                                <Translate component="div" content={"blockchain.witnesses.nextVoteUpdate"} />
                            </Typography>
                            <Typography variant="h5" color="textSecondary">
                                {nextMaintenanceTime}
                            </Typography>
                        </CardContent>
                    </Card>}
                </Grid>
            </Grid>
        </div>
    );
}
