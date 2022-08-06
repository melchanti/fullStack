import { setFilter } from "../reducers/filterReducer";
import { connect } from 'react-redux';

const Filter = (props) => {
  const handleChange = (event) => {
    // input-field value is in variable event.target.value
    let filter = event.target.value;
    props.setFilter(filter);
    filter = "";
  }
  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} />
    </div>
  )
}

export default connect(
  null,
  { setFilter }
)(Filter);