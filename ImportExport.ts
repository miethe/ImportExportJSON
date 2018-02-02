public importClick(model: Workflow) {
                var jqNode;
                jqNode = $($("#import-popup").html());

                var node = jqNode[0];
                var popup = new ImportPopup(model);
                ko.applyBindings(popup, node);
                document.getElementsByTagName("body")[0].appendChild(node);
                $(node).modal();

                $(node).on('hidden', function () {
                    document.getElementsByTagName("body")[0].removeChild(node);
                });

                $(popup.fileInputElementId).change(function () {
                    var docName = _.last($(popup.fileInputElementId).val());
                    popup.fileName(docName);
                });   
            }

            public exportClick(model: Workflow) {
                (<any>####).util.prompt("Exporting will require saving #####. Would you like to save & export?", ["Yes", "Cancel"])
                    .done((result) => {
                    
                        if (result === "Yes") {
                            model.saveCallback();
                            try {
                                var jsonFile = createJsonFile(model);
                                downloadObjectAsJson(jsonFile, "#####");
                            } catch(ex) {
                            }
                        
                        };

                        function createJsonFile(model: Workflow) {

                            var filterList = getFilterList(model)[1]; //filters are stored in an array at model.filters[1]
                            var jsonFilterList = [];

                            $.each(filterList, function (key, value) {
                                try { //below are the specific elements added to the json file. This Should be edited as needed
                                    var newFilter = new FilterObject();
                                    newFilter.FilterName = value.name();
                                    newFilter.ComparedTo = value.comparedTo();
                                    newFilter.ObjectType = value.objectType();
                                    newFilter.Operator = value.operator();
                                    newFilter.Property = value.propertyName();
                                    jsonFilterList.push(newFilter);
                                } catch (ex) {
                                }
                            
                            });

                            return "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(jsonFilterList));
                        }

                        function getFilterList(model: Workflow) {

                            var filtersFromList = [];
                            $.each(model.filters, function (key, value) {
                                filtersFromList.push(value);
                            });
                            return filtersFromList;
                        }

                        function downloadObjectAsJson(dataStr, exportName) {
                          //Downloads to the default browser download folder with the name defined as 'download'+exportName
                            var downloadAnchorNode = document.createElement('a');
                            downloadAnchorNode.setAttribute("href", dataStr);
                            downloadAnchorNode.setAttribute("download", exportName + ".json");
                            downloadAnchorNode.click();
                            downloadAnchorNode.remove();
                        }
                    })
                    .fail(function (message) {
                    });     

            }
