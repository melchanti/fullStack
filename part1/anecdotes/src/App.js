import { useState } from 'react';

const Button = ({text, onClick}) => {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

const MostVotes = ({anecdotes, votes}) => {
  const most = votes.reduce((accum, vote, index) => {
    if (vote > votes[accum]) {
      return index;
    } else {
      return accum;
    }
  }, 0);
  console.log(most);
  return (
    <div>
      <h1>Anecdote with most votes</h1>
      <p>{anecdotes[most]}</p>
      <p>has {votes[most]} votes</p>
    </div>
  )
}
const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounds for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time',
    'Any fool can write code that a computer can understand. Good programmers write code that humans understand.',
    'Premature optmization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavey use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients.'
  ]

  const [selected, setSelected] = useState(0);
  const [votes, updateVotes] = useState(new Array(anecdotes.length).fill(0));

  const handleNextClick = () => {
    let index = Math.floor(Math.random() * 6);
    setSelected(index);
  }

  const handleVoteClick = () => {
    const newVotes = [...votes];
    newVotes[selected] += 1;
    updateVotes(newVotes);
  }

  return (
    <>
      <div>
        <h1>Anecdote of the day</h1>
        <p>{anecdotes[selected]}</p>
        <p>has {votes[selected]} votes</p>
        <Button text = "next anectode" onClick={handleNextClick} />
        <Button text = "vote" onClick={handleVoteClick} />
      </div>
      <MostVotes anecdotes={anecdotes} votes={votes}/>
    </>

  );
}

export default App;
