import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Translate from "react-translate-component";
import Grid from '@material-ui/core/Grid';
import Link from "react-router-dom/es/Link";

const useStyles = makeStyles({
  paper: {
    // textAlign: 'center',
  },
  tablehead: {
    fontSize: 14,
    textAlign: 'center',
    // marginLeft: '40px'
  },
  tabledata: {
    fontSize: 9,
    textAlign: 'center'
  },
  new: {
    borderRadius: '10px',
    border: 'ridge',
    marginTop: '2px'
  }
});

export default function permissionsCards({ className, tableHead, rows, link, onClick, partialFill }) {
  const classes = useStyles();

  return (
    <Card className="cardsTable">
      {rows.map((trItem, trId) => (
        <Grid key={`tr-${trId}`} style={{ borderRadius: '10px', border: 'ridge', marginTop: '2px', position:'relative', }}>
          {tableHead.map((tdItem, tdId) => (
            <Grid container className={classes.paper} key={`td-${tdId}`}>
              <Grid item xs={12} sm={6}>
                <Box component="div" className={classes.tablehead} fontWeight="fontWeightBold">
                  {tdItem.translateTag
                    ? <Translate
                      key={`th-${tdId}`}
                      content={`tableHead.${tdItem.translateTag}`}
                      component="div"
                      with={tdItem.translateParams}
                    />
                    : <div
                      key={`th-${tdId}`}
                      className={`table__cell ${tdItem.params ? tdItem.params : ''}`}
                    />}
                </Box>
              </Grid>
              <Grid item xs={12} sm={6} className="table__row">
                <Typography component="div" className={classes.tabledata} key={`td-${tdId}`}>
                  {trItem[tdItem.key]}
                </Typography>
              </Grid>

            </Grid>

          ))}
          {partialFill
            && <div
              className="table__partialFill"
              style={{
                backgroundColor: partialFill.color,
                width: `${trItem[partialFill.percentKey]}%`
              }}
            />
          }
          {link
            && <Link to={`${link.path}${trItem[link.key]}`} className="table__link" />
          }
          {onClick
            && <button onClick={() => onClick(trItem)} className="table__link" />}
        </Grid>

      ))}
    </Card>
  );
}
