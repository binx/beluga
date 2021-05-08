import React, { useState, useEffect } from 'react';
import styled from "styled-components";
import { withRouter } from "react-router-dom";

import { useDispatch } from "react-redux";

import OrderTable from './OrderTable';
import PageWrapper from '../ui/PageWrapper';
import { Paper, Button } from "@material-ui/core";

const PaginationUI = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #888;
  margin: 20px 20px 0;
  padding: 10px 0;
`;

function Orders(props) {
  const [viewStatus, setViewStatus] = useState("paid");
  const [orders, setOrders] = useState([]);

  const [starting_after, setStartingAfter] = useState(null);
  const [ending_before, setEndingBefore] = useState(null);
  const ordersPerPage = 10;

  const dispatch = useDispatch();

  useEffect(() => {
    const postBody = { status: viewStatus, limit: ordersPerPage };
    getOrders(postBody);
  }, [viewStatus])

  
  const getOrders = (postBody, pagination) => {
    // passing in a pagination variable if we are attempting to paginate

    fetch('/list-orders', {
        method: 'POST',
        headers: new Headers({ 'content-type': 'application/json' }),
        body: JSON.stringify(postBody)
      }).then(res => {
        if (res.redirected)
          props.history.push('/login');
        else
          return res.json();
      })
      .then(results => {
        if (results.error) {
          logout();

        } else if (!results.length) {
          // if we reached no more orders, do nothing
          if (pagination) return;
          // else there are no orders with this status, show empty array
          else setOrders([]);

        } else if (results.length < ordersPerPage) {
          // at the end of our list
          processOrders(results);
          setStartingAfter(null);
          setEndingBefore(results[0].id);
          
        } else {
          processOrders(results);
          setStartingAfter(results[results.length - 1].id);
          if (pagination)
            setEndingBefore(results[0].id);
        }
      });
  }

  const processOrders = results => {
    const newOrders = results.map(r => {
      r["display_status"] = r.metadata.status || "Ordered";
      r["display_tracking"] = "";
      return r;
    })
    setOrders(newOrders);
  }

  const getNextOrders = () => {
    const postBody = {
      status: viewStatus,
      limit: ordersPerPage,
      ending_before: orders[0].id
    };
    getOrders(postBody, true)
  }
  const getPrevOrders = () => {
    const postBody = {
      status: viewStatus,
      limit: ordersPerPage,
      starting_after: orders[orders.length - 1].id
    };
    getOrders(postBody, true)
  }

  const logout = () => {
    fetch('/api/logout', {
      credentials: 'same-origin',
    }).then(res => {
      dispatch({ type: "SET_ADMIN", isAdmin: false })
      props.history.push('/');
    })
  }

  const updateStatus = (i, status) => {
    let newOrders = [...orders];
    newOrders[i].display_status = status;
    setOrders(newOrders)
  }

  const updateTracking = (i, tracking) => {
    let newOrders = [...orders];
    newOrders[i].display_tracking = tracking;
    setOrders(newOrders)
  }

  const updateOrder = index => {
    const order = orders[index],
      status = order.display_status;

    if (status === "Shipped") {
      fetch("/order/ship/", {
          method: 'POST',
          headers: new Headers({ 'content-type': 'application/json' }),
          body: JSON.stringify({
            id: order.id,
            status: status,
            tracking: order.display_tracking
          })
        }).then((response) => response.json())
        .then((json) => {
          let newOrders = [...orders];
          newOrders[index] = json;
          setOrders(newOrders);
        });
    } else {
      fetch("/order/update/", {
          method: 'POST',
          headers: new Headers({ 'content-type': 'application/json' }),
          body: JSON.stringify({
            id: order.id,
            status: status
          })
        }).then((response) => response.json())
        .then((json) => {
          let newOrders = [...orders];
          newOrders[index] = json;
          setOrders(newOrders)
        });
    }
  }

  return (
    <PageWrapper>
      <Paper style={{ position: "relative "}}>
        <Button color="primary" onClick={logout}
          style={{ position: "absolute", right: "20px", top: "10px", zIndex: "1" }}
        >
          Logout
        </Button>

        <OrderTable 
          view_status={viewStatus}
          orders={orders}
          updateOrder={updateOrder}
          updateTracking={updateTracking}
          updateStatus={updateStatus}
          switchView={setViewStatus}
        />

        <PaginationUI>
          <Button color="primary" onClick={getNextOrders} disabled={!ending_before}>
            ← Next
          </Button>
          <Button color="primary" onClick={getPrevOrders} disabled={!starting_after}>
            Prev →
          </Button>
        </PaginationUI>
      </Paper>
    </PageWrapper>
  );
};
export default withRouter(Orders);