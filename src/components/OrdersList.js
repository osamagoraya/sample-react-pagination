import React, { useState, useEffect, useMemo, useRef } from "react";
import Pagination from "@material-ui/lab/Pagination";
import OrderDataService from "../services/OrderService";
import { useTable } from "react-table";
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

const OrdersList = (props) => {

  const [orders, setOrders] = useState([]);
  const [openDetailDrawer, setOpenDetailDrawer] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(false);
  const ordersRef = useRef();

  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const pageSizes = [10, 20, 30];

  ordersRef.current = orders;

  const getRequestParams = (page, pageSize) => {
    let params = {};

    if (page) {
      params["page"] = page - 1;
    }

    if (pageSize) {
      params["size"] = pageSize;
    }

    return params;
  };

  const retrieveOrders = () => {
    const params = getRequestParams(page, pageSize);

    OrderDataService.getAll(params)
      .then((response) => {
        console.log(response);
        const { orders, totalPages } = response.data;

        setOrders(orders);
        setCount(totalPages);

        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(retrieveOrders, [page, pageSize]);


  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (event) => {
    setPageSize(event.target.value);
    setPage(1);
  };

  const handleColumnClick = async (orderId, orders) => {
     console.log("orders", orders.find(order => order._id === orderId));
      setSelectedOrder(orders.find(order => order._id === orderId));
      setOpenDetailDrawer(true);
  }

  const columns = useMemo(
    () => [
      {
        Header: "Order ID",
        accessor: "_id",
      },
      {
        Header: "Prducts",
        accessor: 'products',
        Cell: (props) => {
            const products =  props.value.map( (order) =>(<li>{order.name}</li>))
            return <ul className="products" onClick={() => handleColumnClick(props.row.original._id, props.data)}>{products}</ul>;
        },
      }
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data: orders,
  });

  return (
    <div className="list row">
      <div className="col-md-12 list">


        <table
          className="table table-striped table-bordered"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="mt-3">
          {"Items per Page: "}
          <select onChange={handlePageSizeChange} value={pageSize}>
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <Pagination
            className="my-3"
            count={count}
            page={page}
            siblingCount={1}
            boundaryCount={1}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
          />
        </div>
      </div>
      <Drawer style={{ width: "250px" }} anchor='right' open={openDetailDrawer} onClose={() => setOpenDetailDrawer(false)}>
            <p>Order Details: {selectedOrder._id}</p>
            <div>
            <List>
               {
                  selectedOrder ? 
                  selectedOrder.products.map((product,index) => (
                   <div>
                    <ListItem key={product._id}>
                        <ListItemText secondary={<div><strong>Item Number:</strong>{index}</div>}  />
                        <ListItemText secondary={<div><strong>Item Name: </strong>{product.name}</div>}  />
                    </ListItem>
                    <Divider style={{ width: "100%"}} />
                    </div>
                  ))
                :""
              } 
            </List>
            <List>
      </List>
            </div>
      </Drawer>
    </div>
  );
};

export default OrdersList;
