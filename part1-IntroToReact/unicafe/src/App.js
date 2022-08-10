import { useState } from 'react';

function Button({text, onClick}) {
  return (
    <button onClick={onClick}>{text}</button>
  )
}

function Header(props) {
  const {goodClick, neutralClick, badClick} = props.data;
  return (
    <div>
      <h1>give feedback</h1>
      <Button text='good' onClick={goodClick}/>
      <Button text='neutral' onClick={neutralClick}/>
      <Button text='bad' onClick={badClick}/>
    </div>
  );
}

function StatisticLine({text, total}) {
  return (
    <tr>
      <td>{text}</td>
      <td>{total}</td>
    </tr> 
  );
}
const Statistics = (props) => {
  const {good, neutral, bad} = props.data;
  const total = good + neutral + bad;
  let average = (good + (bad * -1)) / total;
  let positive = (good / total) * 100;

  if (total === 0) {
    return (
      <div>
        <h1>statistics</h1>
        <p>No feedback given</p>
      </div>
    )
  }

  return (
    <div>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticLine text='good' total={good} />
          <StatisticLine text='neutral' total={neutral} />
          <StatisticLine text='bad' total={bad} />
          <StatisticLine text='all' total={total} />
          <StatisticLine text='average' total={average} />
          <StatisticLine text='positive' total={`${positive} %`} />
        </tbody>
      </table>
    </div>
  )
}

function App() {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const goodClick = () => {
    setGood(good + 1);
  }
  const neutralClick = () => {
    setNeutral(neutral + 1);
  }
  const badClick = () => {
    setBad(bad + 1);
  }

  const props = {
    good,
    neutral,
    bad,
    goodClick,
    neutralClick,
    badClick
  }
  return (
    <div>
      <Header data={props}/>
      <Statistics data={props}/>
    </div>
  )
}

export default App;
