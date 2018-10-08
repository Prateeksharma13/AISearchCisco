$( document ).ready(function() {

    var substringMatcher = function() {
      let hits = [];
      let titles = [];

        return function findMatches(q, cb) {
          let url = "http://localhost:9200/cisco/_search?q="+q;
          $.ajax({
              url: url,
              headers: {
                "Content-Type": "application/json"
              },
              success: function(data){
                //console.log(data['hits']['hits']);
                hits = [];
                titles = [];
                for(let i =0; i<10; i++) {
                  hits.push(data['hits']['hits'][i]);
                  if(data['hits']['hits'][i]) {
                    titles.push(data['hits']['hits'][i]['_source']['data']);
                  }
                  console.error(titles);
                }
              }
            });
            // var matches, substringRegex;
            //
            // // an array that will be populated with substring matches
            // matches = [];
            //
            // // regex used to determine if a string contains the substring `q`
            // substrRegex = new RegExp(q, 'i');
            //
            // // iterate through the pool of strings and for any string that
            // // contains the substring `q`, add it to the `matches` array
            // $.each(strs, function(i, str) {
            //     if (substrRegex.test(str)) {
            //         matches.push(str);
            //     }
            // });
            // //
            // // cb(matches);
            cb(titles);
        };
    };

    var states = ['Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California',
        'Colorado', 'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii',
        'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
        'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
        'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
        'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
        'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
        'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
        'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
    ];

    $('#the-basics .typeahead').typeahead({
            hint: true,
            highlight: true,
            minLength: 1
        },
        {
            name: 'states',
            source: substringMatcher()
        });
});
