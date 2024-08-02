
                $(document).ready(function () {
                        $(function(){
                            $("#autocomplete").autocomplete({
                                source: function(request,response){
                                    $.ajax({
                                        url: '/searchdata',
                                        dataType: 'json',
                                        data: {
                                          term: request.term
                                        },
                                        success: function(data) {
                                          response(data);
                                        }
                                      });
                                },
                                autoFocus: true
                            })
                            
                        })
                })
