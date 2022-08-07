const getData = (onSuccess)  => {
    fetch('http://localhost:3000/tickets')
      .then((response) => response.json())
      .then((tickets) => {
        onSuccess(tickets);
      });
  };

  export {getData};