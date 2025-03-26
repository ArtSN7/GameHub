  useEffect(() => {
    fetch('/api/hello')
      .then(response => response.json())
      .then(data => console.log(data.message))
      .catch(error => console.error('Error fetching data:', error));
  }, []);