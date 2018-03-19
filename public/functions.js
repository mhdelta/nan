module.exports = {
  ConsumeServicePromise:
    function ($q, http, Url, data = "", contentType = "application/json", method = "POST") {
      try {
        var defered = $q.defer();
        var promise = defered.promise;

        var config = {
          "async": true,
          "crossDomain": true,
          "method": method,
          "url": Url,
          "headers": {
            'Content-Type': contentType,
            'cache-control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
          },
          "data": data,
          "processData": false
        };
        http(config).then(
          function (data) {
            defered.resolve(data);
          },
          function (err) {
            defered.reject(err);
          }
        );

        return promise;
      } catch (e) {
        console.log(e);
      }
    },
  bar: function () {
    // whatever
  }
};