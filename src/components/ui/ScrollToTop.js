import { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

function ScrollToTop(props) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [props.location.pathname])

  return (props.children);
}

export default withRouter(ScrollToTop);