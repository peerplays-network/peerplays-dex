import React, { Fragment, useEffect, useState } from "react";
import IconCheckBlue  from "../../../svg/check_blue.svg";
import Table from "../../helpers/table";
import TableCard from "../../helpers/cards";
import counterpart from "counterpart";

const VotingPage = (props) => {
    const [active, setActive] = useState(false);
    const [pending, setPending] = useState(false);

    const buttons = (id) => ({
        toVote: <button onClick={() => addToVote(id)}><IconCheckBlue className="vote__like" /></button>,
        fromVote: <button onClick={() => removeFromVote(id)}><IconCheckBlue className="mask vote__like" /></button>
    });

    const formatVote = (array) => {
        return array.map((item, index) => {
            return ({
                ...item,
                rank: index + 1,
                vote_icon: buttons(item.vote_id)[props.hooks.newVotes.find(elem => elem === item.vote_id) ? 'fromVote' : 'toVote']
            })
        })
    };

    const addToVote = (id) => {
        if (!props.hooks.newVotes.includes(id)) {
            let voteList = props.hooks.newVotes;
            voteList.push(id);
            props.hooks.setNewVotes([...voteList]);
        }

    };

    const removeFromVote = (id) => {
        let voteList = props.hooks.newVotes.filter(item => item !== id);
        props.hooks.setNewVotes([...voteList]);
        setActive(formatVote(active))
        setPending(formatVote(pending))
    };


    useEffect(() => {
        setActive(formatVote(props.votes.filter(item => item.active)));
        setPending(formatVote(props.votes.filter(item => !item.active)));
    }, [props])


    const { tableHead } = props;

    return (
        <div className="voting__table">
            {
                active &&
                <Fragment>
                    <div className="table__title">{counterpart.translate(`blockchain.witnesses.active`)}</div>
                    <Table
                        tableHead={tableHead}
                        rows={active}
                    />
                    <TableCard rows={active} tableHead={tableHead} />
                </Fragment>
            }

            {
                pending &&
                <Fragment>
                    <div className="table__title">{counterpart.translate(`blockchain.witnesses.pending`)}</div>
                    <Table
                        tableHead={tableHead}
                        rows={pending}
                    />
                    <TableCard rows={pending} tableHead={tableHead} />
                </Fragment>
            }
        </div>
    )

}

export default VotingPage;