/**
 * Created by harsh on 28/11/16.
 */

msfReportsApp.directive('calendar', function () {
    return {
        require: 'ngModel',
        link: function (scope, el, attr, ngModel) {
            $(el).datepicker({
                dateFormat: 'yy-mm-dd',
                onSelect: function (dateText) {
                    scope.$apply(function () {
                        ngModel.$setViewValue(dateText);
                    });
                }
            });
        }
    };
});

msfReportsApp
    .controller('performanceReportController', function( $rootScope,
                                                     $scope,
                                                     $timeout,
                                                     MetadataService,
                                                     sqlviewservice) {



        //Production IDS
        const SQLVIEW_TEI_PS = "FcXYoEGIQIR";
        const SQLVIEW_TEI_ATTR = "WMIMrJEYUxl";
        const SQLVIEW_EVENT = "IQ78273FQtF";

        // local
        // const SQLVIEW_TEI_PS =  "gCxkn0ha6lY";
        // const SQLVIEW_TEI_ATTR = "HKe1QCVogz9";
        // const SQLVIEW_EVENT = "bTNJn5CbnOY";

        jQuery(document).ready(function () {
            hideLoad();
        })
        $timeout(function () {
            $scope.date = {};
            $scope.date.startDate = new Date();
            $scope.date.endDate = new Date();
        }, 0);

        //initially load tree
        selection.load();

        // Listen for OU changes
        selection.setListenerFunction(function () {
            getAllPrograms();
            $scope.selectedOrgUnitUid = selection.getSelected();
            loadPrograms();
        }, false);

        loadPrograms = function () {
            MetadataService.getOrgUnit($scope.selectedOrgUnitUid).then(function (orgUnit) {
                $timeout(function () {
                    $scope.selectedOrgUnit = orgUnit;
                });
            });
        }
        
        getAllPrograms = function () {
            var program=['HTCqTWEF1XS','K3XysZ53B4r','CsEmq8UNA6z'];
            $scope.Allprograms=[];

            for(var i=0;i<program.length;i++)
            {
                MetadataService.getAggregatedata(program[i]).then(function (progdata) {
                
                    if(progdata.id=='HTCqTWEF1XS')
                    {
                        progdata.name="Anaesthetist- PBR monitoring(Aggregated)";
                        $scope.Allprograms.push(progdata);
                    }
                    if(progdata.id=='K3XysZ53B4r')
                    {
                        progdata.name="Gynaecologist- PBR monitoring(Aggregated)";
                        $scope.Allprograms.push(progdata);
                    }
                    if(progdata.id=='CsEmq8UNA6z')
                    {
                        progdata.name="Paediatric- PBR monitoring(Aggregated)";
                        $scope.Allprograms.push(progdata);
                    }
                   
                           
                });
    
            }
           
            for(var i=0;i<program.length;i++)
            {
            MetadataService.remakreport(program[i]).then(function (prog1) {
                
                if(prog1.id=='HTCqTWEF1XS')
                    {
                        prog1.name="Anaesthetist Remarks Report";
                        $scope.Allprograms.push(prog1);
                    }
                    if(prog1.id=='K3XysZ53B4r')
                    {
                        prog1.name="Gynaecologist Remarks Report";
                        $scope.Allprograms.push(prog1);
                    }
                    if(prog1.id=='CsEmq8UNA6z')
                    {
                        prog1.name="Paediatric Remarks Report";
                        $scope.Allprograms.push(prog1);
                    }
                
                       
            });
        }
            MetadataService.getAllPrograms().then(function (prog) {
                for (var i = 0; i < prog.programs.length; i++) {
                    if (prog.programs[i].withoutRegistration == false) {
                        $scope.Allprograms.push(prog.programs[i]);
                    }
                   
                }
               // $scope.programs.push({name:"",id:""});
            });

           $scope.basicUrl = "../api/sqlViews/";
        sqlviewservice.getAll().then(function(data){
            $scope.sqlViews = data.sqlViews;

            for(var i=0;i<$scope.sqlViews.length;i++)
            {
                if($scope.sqlViews[i].name=="Org Unit Path")
                {
                    $scope.Org_Unit_Path=$scope.sqlViews[i].id;
        
                }
            }
            
        })
            getAllProg($scope.Allprograms)
        }

        getAllProg=function(Allprograms)
        {
            $scope.programs = [];
           
            for(var i=0;i<Allprograms.length;i++)
            {
                $scope.programs.push(Allprograms[i]);
            }
        }
        $scope.updateStartDate = function (startdate) {
            $scope.startdateSelected = startdate;
            //  alert("$scope.startdateSelected---"+$scope.startdateSelected);
        };

        $scope.updateEndDate = function (enddate) {
            $scope.enddateSelected = enddate;
            //  alert("$scope.enddateSelected---"+ $scope.enddateSelected);
        };

        $scope.fnExcelReport = function () {

            var blob = new Blob([document.getElementById('divId').innerHTML], {
                type: 'text/plain;charset=utf-8'
            });
            saveAs(blob, "Report.xls");

        };

        $scope.generateReport = function (program) {
            $scope.selectedOrgUnitName = $scope.selectedOrgUnit.name;
            $scope.selectedStartDate = $scope.startdateSelected;
            $scope.selectedEndDate = $scope.enddateSelected;
            $scope.program = program;

            for (var i = 0; i < $scope.program.programTrackedEntityAttributes.length; i++) {
                var str = $scope.program.programTrackedEntityAttributes[i].displayName;
                var n = str.lastIndexOf('-');
                $scope.program.programTrackedEntityAttributes[i].displayName = str.substring(n + 1);

            }
            $scope.psDEs = [], $scope.psDEs1=[];
            $scope.Options = [];
            $scope.attribute = "Attributes";
            $scope.org = "Organisation Unit : ";
            $scope.start = "Start Date : ";
            $scope.end = "End Date : ";
            $scope.enrollment = ["Enrollment date", "Enrolling orgUnit"];
            var options = [];
            
            
            
            de_array=['vhG2gN7KaEK','qbgFsR4VWxU','zfMOVN2lc1S','kChiZJPd5je','wTdcUXWeqhN','eryy31EUorR','cqw0HGZQzhD'];
            $scope.newde_array=['PTDWef0EKBH','C1Hr5tSOFhO','JpKS1QTfeIs','Wc8omZwzJeP','U1PC32JYO7q','WQv29jW1hxt'];
            
            var index = 0;
            for (var i = 0; i < $scope.program.programStages.length; i++) {

                var psuid = $scope.program.programStages[i].id;
               $scope.programid=$scope.program.id;
               $scope.programname=$scope.program.name;
               

               if($scope.programname=='Anaesthetist- PBR monitoring(Aggregated)' || $scope.programname=='Gynaecologist- PBR monitoring(Aggregated)')
               {
                $("#showdata").empty();
                $scope.new_psuid = $scope.program.programStages[i].id;
                $scope.psDEs1.push({dataElement: {id: "orgUnit", name: "orgUnit", ps: psuid}});
                $scope.psDEs1.push({dataElement: {id: "Specialist-Name", name: "Specialist Name", ps: psuid}});
                
                $scope.header=['',''];
               
                for (var j = 0; j < $scope.program.programStages[i].programStageDataElements.length; j++) {

                    $scope.program.programStages[i].programStageDataElements[j].dataElement.ps = psuid;
                    var de = $scope.program.programStages[i].programStageDataElements[j];
                    
                    
                    for(var xx=0;xx<de_array.length;xx++)
                    {
                        if(de.dataElement.id==de_array[xx])
                        $scope.psDEs.push(de);
                    }
                    program["newlength"] = $scope.psDEs1.length;

                    if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet != undefined) {
                        if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options != undefined) {

                            for (var k = 0; k < $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options.length; k++) {
                                index = index + 1; // $scope.Options.push($scope.program.programStages[i].programStageDataElements[j]);
                                var code = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code;
                                var name = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;

                                options.push({code: code, name: name});
                                $scope.Options[$scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code + "_index"] = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;
                            }
                        }
                    }
                }
                for(var pe=0;pe<$scope.psDEs.length;pe++ )
                {
                    $scope.header.push('Case Load','Value','Points') ;
                }
                $scope.header.push("Total Points");
                
               }

               if($scope.programname=="Paediatric- PBR monitoring(Aggregated)" && psuid=="PfRIIrvnjcU" )
                {
                    $("#showdata").empty();
                
                $scope.psDEs1.push({dataElement: {id: "Specialist-Name", name: "Specialist Name", ps: psuid}});
                $scope.psDEs1.push({dataElement: {id: "orgUnit", name: "orgUnit", ps: psuid}});
                $scope.psDEs.push({dataElement: {id: "DE1", name: "Attend pediatric OPD/ newborn babies  of the hospital (follow-up OPD post discharge from SNCU.) as per schedule.", ps: psuid}});
                $scope.psDEs.push({dataElement: {id: "DE2", name: "Attend complicated deliveries/caesarean sections/if required. (No of Pediatric Emergency Cases attended in day time)", ps: psuid}});
                $scope.psDEs.push({dataElement: {id: "DE3", name: "Examine all babies in the PNC ward during duty hours, and enter progress of new born in case sheet about the condition of baby   and screen for any congenital anomalies (if present- must be reported in case sheet) as well.By Self (Doctors/Specialist)                ", ps: psuid}});
                $scope.psDEs.push({dataElement: {id: "DE4", name: " No of Paediatric cases treated as inpatient a. Out-born admissions (During the Shift)b. Pre-term admissions (During the Shift) c. Low-Birth weight admissions (During the Shift) (Reported from Emergency in duty hours) By Self (Doctors/Specialist)", ps: psuid}});
                $scope.psDEs.push({dataElement: {id: "DE5", name: "Monthly Reporting a. Submission of Complete monthly SNCU report by 5th of next month b. BOR c. Concurrent monitoring score                ", ps: psuid}});
               
                $scope.header=['',''];
               
                for (var j = 0; j < $scope.program.programStages[i].programStageDataElements.length; j++) {
                    $scope.new_psuid = $scope.program.programStages[i].id;
               
                    $scope.program.programStages[i].programStageDataElements[j].dataElement.ps = psuid;
                    var de = $scope.program.programStages[i].programStageDataElements[j];
                    
                    
                    program["newlength"] = $scope.psDEs.length;

                   

                    if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet != undefined) {
                        if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options != undefined) {

                            for (var k = 0; k < $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options.length; k++) {
                                index = index + 1; // $scope.Options.push($scope.program.programStages[i].programStageDataElements[j]);
                                var code = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code;
                                var name = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;

                                options.push({code: code, name: name});
                                $scope.Options[$scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code + "_index"] = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;
                            }
                        }
                    }
                }

                
                for(var pe=0;pe<$scope.psDEs.length;pe++ )
                    {
                        $scope.header.push('Case Load','Value','Points') ;
                    }
                    $scope.header.push("Total Points");

            }
               if(($scope.programname=="Paediatric Remarks Report" && psuid=="PfRIIrvnjcU" )||$scope.programname=="Anaesthetist Remarks Report" ||$scope.programname=="Gynaecologist Remarks Report" )
                {
                    $("#showdata").empty();
                $scope.new_psuid = $scope.program.programStages[i].id;
                $scope.psDEs1.push({dataElement: {id: "eventDate", name: "eventDate", ps: psuid}});
                $scope.psDEs1.push({dataElement: {id: "orgUnit", name: "orgUnit", ps: psuid}});
                $scope.psDEs1.push({dataElement: {id: "Specialist-Name", name: "Specialist Name", ps: psuid}});
                $scope.psDEs1.push({dataElement: {id: "contact-number", name: "Contact Number", ps: psuid}});
               
                $scope.header=['','',''];
               
                for (var j = 0; j < $scope.program.programStages[i].programStageDataElements.length; j++) {

                    $scope.program.programStages[i].programStageDataElements[j].dataElement.ps = psuid;
                    var de = $scope.program.programStages[i].programStageDataElements[j];
                    
                    
                    for(var xx=0;xx<$scope.newde_array.length;xx++)
                    {
                        if(de.dataElement.id==$scope.newde_array[xx])
                        $scope.psDEs1.push(de);
                    }
                    program["newlength"] = $scope.psDEs1.length;

                    if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet != undefined) {
                        if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options != undefined) {

                            for (var k = 0; k < $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options.length; k++) {
                                index = index + 1; // $scope.Options.push($scope.program.programStages[i].programStageDataElements[j]);
                                var code = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code;
                                var name = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;

                                options.push({code: code, name: name});
                                $scope.Options[$scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code + "_index"] = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;
                            }
                        }
                    }
                }

                
               

            }
                if($scope.programname=="Paediatric - PBR monitoring" && psuid=="PfRIIrvnjcU" )
                {
                    $("#showdata").empty();
            
                $scope.psDEs1.push({dataElement: {id: "eventDate", name: "eventDate", ps: psuid}});
                $scope.psDEs1.push({dataElement: {id: "orgUnit", name: "orgUnit", ps: psuid}});
                $scope.psDEs1.push({dataElement: {id: "Specialist-Name", name: "Specialist Name", ps: psuid}});
                $scope.psDEs.push({dataElement: {id: "DE1", name: "Attend pediatric OPD/ newborn babies  of the hospital (follow-up OPD post discharge from SNCU.) as per schedule.", ps: psuid}});
                $scope.psDEs.push({dataElement: {id: "DE2", name: "Attend complicated deliveries/caesarean sections/if required. (No of Pediatric Emergency Cases attended in day time)", ps: psuid}});
                $scope.psDEs.push({dataElement: {id: "DE3", name: "Examine all babies in the PNC ward during duty hours, and enter progress of new born in case sheet about the condition of baby   and screen for any congenital anomalies (if present- must be reported in case sheet) as well.By Self (Doctors/Specialist)                ", ps: psuid}});
                $scope.psDEs.push({dataElement: {id: "DE4", name: " No of Paediatric cases treated as inpatient a. Out-born admissions (During the Shift)b. Pre-term admissions (During the Shift) c. Low-Birth weight admissions (During the Shift) (Reported from Emergency in duty hours) By Self (Doctors/Specialist)", ps: psuid}});
                $scope.psDEs.push({dataElement: {id: "DE5", name: "Monthly Reporting a. Submission of Complete monthly SNCU report by 5th of next month b. BOR c. Concurrent monitoring score                ", ps: psuid}});
               
                $scope.header=['','',''];
               
                for (var j = 0; j < $scope.program.programStages[i].programStageDataElements.length; j++) {
                    $scope.new_psuid = $scope.program.programStages[i].id;
               
                    $scope.program.programStages[i].programStageDataElements[j].dataElement.ps = psuid;
                    var de = $scope.program.programStages[i].programStageDataElements[j];
                    
                    
                    program["newlength"] = $scope.psDEs.length;

                   

                    if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet != undefined) {
                        if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options != undefined) {

                            for (var k = 0; k < $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options.length; k++) {
                                index = index + 1; // $scope.Options.push($scope.program.programStages[i].programStageDataElements[j]);
                                var code = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code;
                                var name = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;

                                options.push({code: code, name: name});
                                $scope.Options[$scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code + "_index"] = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;
                            }
                        }
                    }
                }

                
                for(var pe=0;pe<$scope.psDEs.length;pe++ )
                    {
                        $scope.header.push('Case Load','Value','Points') ;
                    }
                    $scope.header.push("Total Points");

            }
                if(($scope.programname=='Anaesthetist - PBR monitoring' && $scope.programid=="HTCqTWEF1XS")  || ($scope.programname=='Gynaecologist - PBR monitoring' &&  $scope.programid=="K3XysZ53B4r" ))
                {
                    $("#showdata").empty();
                $scope.psDEs1.push({dataElement: {id: "eventDate", name: "eventDate", ps: psuid}});
                $scope.psDEs1.push({dataElement: {id: "orgUnit", name: "orgUnit", ps: psuid}});
                $scope.psDEs1.push({dataElement: {id: "orgUnit", name: "Specialist Name", ps: psuid}});
                
                $scope.header=['','',''];
               
                for (var j = 0; j < $scope.program.programStages[i].programStageDataElements.length; j++) {

                    $scope.program.programStages[i].programStageDataElements[j].dataElement.ps = psuid;
                    var de = $scope.program.programStages[i].programStageDataElements[j];
                    
                    for(var xx=0;xx<de_array.length;xx++)
                    {
                        if(de.dataElement.id==de_array[xx])
                        $scope.psDEs.push(de);
                    }
                    

                    program["newlength"] = $scope.psDEs.length;


                    if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet != undefined) {
                        if ($scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options != undefined) {

                            for (var k = 0; k < $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options.length; k++) {
                                index = index + 1; // $scope.Options.push($scope.program.programStages[i].programStageDataElements[j]);
                                var code = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code;
                                var name = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;

                                options.push({code: code, name: name});
                                $scope.Options[$scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].code + "_index"] = $scope.program.programStages[i].programStageDataElements[j].dataElement.optionSet.options[k].displayName;
                            }
                        }
                    }
                }

                
                for(var pe=0;pe<$scope.psDEs.length;pe++ )
                    {
                        $scope.header.push('Case Load','Value','Points') ;
                    }
                    $scope.header.push("Total Points");

            }
        }

            //  var param = "var=program:"+program.id + "&var=orgunit:"+$scope.selectedOrgUnit.id+"&var=startdate:"+moment($scope.date.startDate).format("YYYY-MM-DD")+"&var=enddate:"+moment($scope.date.endDate).format("YYYY-MM-DD");
            var param = "var=program:" + program.id + "&var=orgunit:" + $scope.selectedOrgUnit.id + "&var=startdate:" + $scope.startdateSelected + "&var=enddate:" + $scope.enddateSelected;

            MetadataService.getSQLView(SQLViewsName2IdMap[SQLQUERY_EVENT_NAME], param).then(function (stageData) {
                $scope.stageData = stageData;
                arrangeDataX($scope.stageData, $scope.programid,psuid,$scope.programname,$scope.new_psuid);
            })
        };

        function showLoad() {
            // alert( "inside showload method 1" );
            setTimeout(function () {
                //  document.getElementById('load').style.visibility="visible";
                //   document.getElementById('tableid').style.visibility="hidden";

            }, 1000);

            //     alert( "inside showload method 2" );
        }

        function hideLoad() {
            //  document.getElementById('load').style.visibility="hidden";
            //  document.getElementById('tableid').style.visibility="visible";
        }

        function arrangeDataX(stageData,program,psuid,programname,new_psuid) {
            Loader.showLoader()
            // For Data values
            const index_deuid = 4;
            const index_devalue = 6;
            const index_ps = 0;
            const index_ev = 2;
            const index_evDate = 3;
            const index_ou = 7;
            const index_ouid=9;


            $scope.eventList = [];
            $scope.eventMap = [];
            $scope.eventDeWiseValueMap = [];




            var org_h=[];

            for (var x = 0; x < stageData.height; x++) {

                    var sel_org_uid = stageData.rows[x][9];
                    org_h.push(sel_org_uid);



                  }
            org_h = org_h.filter( function( item, index, inputArray ) {
                return inputArray.indexOf(item) == index;
            });
            var org_path=[];
            for(var y=0;y<org_h.length;y++)
            {
                org_uid=org_h[y];

                $.ajax({
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json",
                    async:false,
                    url: "../../organisationUnits/" + org_uid + ".json?fields=id,path&paging=false",
                     success: function (data) {
                         org_path[org_uid]=data.path;
                    }
                });

            }
           // var org_val = getorghirarcy(org_path);


            for (var i = 0; i < stageData.height; i++) {


                var psuid = stageData.rows[i][index_ps];
                var evuid = stageData.rows[i][index_ev];
                var evDate = stageData.rows[i][index_evDate];
                evDate = evDate.substring(0, 10);
                var deuid = stageData.rows[i][index_deuid];
                var devalue = stageData.rows[i][index_devalue];
                var ou =stageData.rows[i][index_ou];
                var ou_id=stageData.rows[i][index_ouid];
                /*var newkey=stageData.rows[i][9];
                for(var key in org_val)
                {
                    if(key==newkey)
                    {
                        var ou =org_val[key];
                    }


                }*/

                if (!$scope.eventMap[evuid]) {
                    $scope.eventMap[evuid] = {
                        event: evuid,
                        data: []
                    };

                    $scope.eventDeWiseValueMap[evuid + "-orgUnit"] = ou;
                    $scope.eventDeWiseValueMap[evuid + "-eventDate"] = evDate;
                    $scope.eventDeWiseValueMap[evuid + "-orgunitid"] = ou_id;
                    
                    $scope.eventDeWiseValueMap[evuid + "-activity"] = "";

                    
                   

                }

                $scope.eventMap[evuid].data.push({
                    de: deuid,
                    value: devalue
                });
                $scope.eventDeWiseValueMap[evuid + "-" + deuid] = devalue;
               
               
                for (m in $scope.Options) {

                    if (devalue + '_index' == m) {

                        $scope.eventDeWiseValueMap[evuid + "-" + deuid] = $scope.Options[m];
                        
                    }

                }
            }

            


            for(var m in $scope.eventMap)
            {
                $scope.eventList.push(m);
            }



           /** $timeout(function () {
                $scope.eventList = prepareListFromMap($scope.eventMap);

            })**/

////Anaesthetist- PBR monitoring(Aggregated)
if(program=="HTCqTWEF1XS" &&programname=='Anaesthetist- PBR monitoring(Aggregated)')
{
    
           for(var i=0;i<$scope.eventList.length;i++)
           {

            var eveid=$scope.eventList[i];
            $.ajax({
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                async:false,
                url: "../../events/"+eveid+".json",
                 success: function (data) {
                     var teiid=data.trackedEntityInstance;

                     $.ajax({
                        type: "GET",
                        dataType: "json",
                        contentType: "application/json",
                        async:false,
                        url: "../../trackedEntityInstances/"+teiid+".json",
                         success: function (datanew) {
                            
                            for(var jj=0;jj<datanew.attributes.length;jj++)
                            {

                                var val=datanew.attributes[jj].attribute;
                                if(datanew.attributes[jj].attribute=="U0jQjrOkFjR")
                                {
                                    $scope.eventDeWiseValueMap[eveid+"-"+datanew.attributes[jj].attribute]=datanew.attributes[jj].value;
                                }
                            }
        
        
                             
                        }
                    });

                }
            });
           }


           $scope.neweventval=[];
           var case1=0,case2=0,case3=0;
          

           $scope.keyspresent=[];$scope.keyspresent_val=[];
            for(var j in $scope.eventDeWiseValueMap)
                {
                    
                    if(j.includes('U0jQjrOkFjR'))
                    {
                        $scope.keyspresent[j]=$scope.eventDeWiseValueMap[j];
                        
                    }

                }

                
               
                $scope.duplicateval=[]
                    
                $scope.key=Object.keys($scope.keyspresent);

                var sortable = [];
                for (var d in $scope.keyspresent) {
                    sortable.push([d, $scope.keyspresent[d]]);
                }
                
                $scope.keyspresent=sortable.sort(function(a,b) {
                    return (a[1] > b[1]) ? 1 : ((b[1] > a[1]) ? -1 : 0);
                } );
                            for(var x =0;x<$scope.keyspresent.length;x++)
                            { 
                               //var h=$scope.keyspresent[x+1][1];
                            if( (x+1)<$scope.keyspresent.length-1)
                            {
                                if($scope.keyspresent[x][1]==$scope.keyspresent[x+1][1] )
                                {
                                     $scope.duplicateval.push($scope.keyspresent[x][1]);
                                     //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                                }
                            }
                               
                            }


                            var new_sortable=[];
                            for(var x=0;x<$scope.keyspresent.length;x++)
                            { 
                                new_sortable[$scope.keyspresent[x][0]]=$scope.keyspresent[x][1];


                            }
                         
                            $scope.keyspresent=new_sortable;
                        
                        $scope.duplicateval = $scope.duplicateval.filter( function( item, index, inputArray ) {
                            return inputArray.indexOf(item) == index;
                            });

                         for(var i=0;i<$scope.duplicateval.length;)
                             {
                            for(var x in $scope.keyspresent)
                            { 
                               
                            
                               if($scope.keyspresent[x]==$scope.duplicateval[i])
                                {
                                    var val1=x.split('-');
                                    $scope.neweventval.push(val1[0]);
                                    //$scope.duplicateval.push($scope.keyspresent[$scope.key[i]]);
                                     //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                                }
                                
                                
                            }
                            i++;
                            $scope.neweventval = $scope.neweventval.filter( function( item, index, inputArray ) {
                                return inputArray.indexOf(item) == index;
                                });

                                if($scope.neweventval.length!=0)
                                {
                                    $scope.FinalEnteredVal=getFinalvalue($scope.eventDeWiseValueMap,$scope.neweventval,$scope.programname); 

                                            var org=getheirarchy($scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'orgunitid']);

                                            //var org=$scope.FinalEnteredVal["orgunit"];
                                            var specialist_name=$scope.FinalEnteredVal["U0jQjrOkFjR"];
                                            var case1=$scope.FinalEnteredVal["vhG2gN7KaEK"];
                                            var case2=$scope.FinalEnteredVal["qbgFsR4VWxU"];
                                            var case3=$scope.FinalEnteredVal["zfMOVN2lc1S"];
                                            
                                        var case1_load,case1_val,case1_point,
                                                        case2_load,case2_val,case2_point,
                                                            case3_Load,case3_val,case3_point;
                    ///case 1
                                            if(case1==undefined)
                                            {
                                                case1_load=0;
                                                case1_val=0;
                                                case1_point=0;
                                                
                                            }
                                            else
                                            {
                                                if(case1>=6 && case1<=8)
                                                {
                                                    case1_load="6 to 8";
                                                    case1_val=case1;
                                                    case1_point="5";
                                                }
                                                else if(case1>=9 && case1<=11)
                                                {
                                                    case1_load="9 to 11";
                                                    case1_val=case1;
                                                    case1_point="7.5";
                                                }
                                                else if(case1>=12 && case1<=15)
                                                {
                                                    case1_load="12 to 15";
                                                    case1_val=case1;
                                                    case1_point="10";
                                                }
                                                else if( case1>=15)
                                                {
                                                    case1_load=">15";
                                                    case1_val=case1;
                                                    case1_point="15";
                                                }
                                                else{
                                                    case1_load="0";
                                                    case1_val=case1;
                                                    case1_point="0";
                                                }
                                                
                                            }
                                            

                    ///////////case 2
                                            if(case2==undefined)
                                            {
                                                case2_load=0;
                                                case2_val=0;
                                                case2_point=0;
                                            }
                                            else
                                            {
                                            if(case2!=undefined)
                                            {
                                            if(case2>0 && case2<=2 )
                                            {
                                                case2_load="Up to 2";
                                                case2_val=case2;
                                                case2_point="5";
                                            }
                                            else if(case2>=3 && case2<=5)
                                            {
                                                case2_load="3 to 5";
                                                case2_val=case2;
                                                case2_point="7.5";
                                            }
                                            else if(case2>=6 && case2<=8)
                                            {
                                                case2_load="6 to 8";
                                                case2_val=case2;
                                                case2_point="10";
                                            }
                                            else
                                            {
                                                case2_load="0";
                                                case2_val=case2;
                                                case2_point="0";
                                            }
                                        }
                                    }
                                            /////case 3
                                            
                                            if(case3==undefined)
                                            {
                                                case3_Load=0;
                                                case3_val=0;
                                                case3_point=0;
                                            }
                                            else
                                            {
                                                if(case3!=undefined)
                                            {
                                            if(case3>0 && case3<=6 )
                                            {
                                                case3_Load="Upto 5";
                                                case3_val=case3;
                                                case3_point="2.5";
                                            }
                                            else if(case3>=6 && case3<=10)
                                            {
                                                case3_Load="6 to 10";
                                                case3_val=case3;
                                                case3_point="5";
                                            }
                                            else if(case3>=11 && case1<=15)
                                            {
                                                case3_Load="11 to 15";
                                                case3_val=case3;
                                                case3_point="7.5";
                                            }
                                            else if( case3>=15)
                                            {
                                                case3_Load=">15";
                                                case3_val=case3;
                                                case3_point="10";
                                            }
                                            else {
                                                case3_Load="0";
                                                case3_val=case3;
                                                case3_point="0";
                                            }
                                        }
                                    }
                                        var tt=Number(case2_point),ttt=Number(case2_point),ttttt=tt+ttt;
                                        
                                    $scope.total=(Number(case1_point)+Number(case2_point)+Number(case3_point)).toFixed(2);
                                            if($scope.total=="NaN")
                                            $scope.total=0;
                                            
                                            $scope.dataimport=$(
                                                "<tr>"+
                                                "<th>"+org+"</th>"+
                                                "<th>"+specialist_name+"</th>"+
                                                
                                                "<th>"+case1_load+"</th>"+
                                                "<th>"+case1_val+"</th>"+
                                                "<th>"+case1_point+"</th>"+

                                                "<th>"+case2_load+"</th>"+
                                                "<th>"+case2_val+"</th>"+
                                                "<th>"+case2_point+"</th>"+

                                                "<th>"+case3_Load+"</th>"+
                                                "<th>"+case3_val+"</th>"+
                                                "<th>"+case3_point+"</th>"+
                                                
                                                "<th>"+$scope.total+"</th>"+
                                                
                                                
                                                "</tr>"
                                                
                                        )
                                    
                                
                                $("#showdata").append($scope.dataimport);
                                }
                               
                                $scope.neweventval=[];
                }

                      
                $scope.duplicateval = $scope.duplicateval.filter( function( item, index, inputArray ) {
                    return inputArray.indexOf(item) == index;
                    });


                $scope.final_keyspresent=[]
                        for(var k in $scope.keyspresent)
                        {
                            $scope.keyspresent_val.push($scope.keyspresent[k]);
                        }
                        $scope.keyspresent_val = $scope.keyspresent_val.sort();
                
                        var hhhh=[];
                        
                            for(var k=0;k<$scope.duplicateval.length;k++)
                            {
                                for(var jj=$scope.keyspresent_val.length-1;jj>=0;jj--)
                                {
                                    if($scope.duplicateval[k]==$scope.keyspresent_val[jj])
                                    {
                                        $scope.keyspresent_val.splice(jj,1);
                                    
                                    }
                                    
                            }
                            
                        }


                        $scope.final_singleval=[]
                        for(var x in $scope.keyspresent)
                                { 
                                    for(var y=0;y<$scope.keyspresent_val.length;y++)
                                    {
                                        if($scope.keyspresent_val[y]==$scope.keyspresent[x])
                                        {
                                            var val=x.split('-');
                                            $scope.final_singleval.push(val[0]);
                                        }
                                    }

                                }





                                $scope.eventDeWiseValueMap_final=[]
                                 
                                    for(var y=0;y<$scope.final_singleval.length;y++)
                                    {
                                        for(var x in $scope.eventDeWiseValueMap)
                                    {
                                        
                                        var v=x.includes($scope.final_singleval[y]);
                                        if(v)
                                        {
                                            $scope.eventDeWiseValueMap_final[x]=$scope.eventDeWiseValueMap[x];
                                        }

                                }
                            }
                                    



                            for(var i=0;i<$scope.final_singleval.length;i++)
                            {

                            
                            for(var j in $scope.eventDeWiseValueMap_final)
                            {
                               
                                var new_uid=j.split('-');
                                
                                if($scope.final_singleval[i]==new_uid[0])
                                {
                                    var org=getheirarchy($scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'orgunitid']);
                                    //var org=$scope.eventDeWiseValueMap_final[$scope.final_singleval[i]+'-'+'orgUnit'];
                                    var specialist_name=$scope.eventDeWiseValueMap_final[$scope.final_singleval[i]+'-'+'U0jQjrOkFjR'];
                                    
                                    var case1=$scope.eventDeWiseValueMap_final[$scope.final_singleval[i]+'-'+'vhG2gN7KaEK'];
                                    var case2=$scope.eventDeWiseValueMap_final[$scope.final_singleval[i]+'-'+'qbgFsR4VWxU'];
                                    var case3=$scope.eventDeWiseValueMap_final[$scope.final_singleval[i]+'-'+'zfMOVN2lc1S'];
                                     
                                var case1_load,case1_val,case1_point,
                                                case2_load,case2_val,case2_point,
                                                    case3_Load,case3_val,case3_point;
            ///case 1
                                    if(case1==undefined)
                                    {
                                        case1_load=0;
                                        case1_val=0;
                                        case1_point=0;
                                        
                                    }
                                    else
                                    {
                                        if(case1>=6 && case1<=8)
                                        {
                                            case1_load="6 to 8";
                                            case1_val=case1;
                                            case1_point="5";
                                        }
                                        else if(case1>=9 && case1<=11)
                                        {
                                            case1_load="9 to 11";
                                            case1_val=case1;
                                            case1_point="7.5";
                                        }
                                        else if(case1>=12 && case1<=15)
                                        {
                                            case1_load="12 to 15";
                                            case1_val=case1;
                                            case1_point="10";
                                        }
                                        else if( case1>=15)
                                        {
                                            case1_load=">15";
                                            case1_val=case1;
                                            case1_point="15";
                                        }
                                        else {
                                            case1_load="0";
                                            case1_val=case1;
                                            case1_point="0";
                                        }
                                        
                                    }
                                    

            ///////////case 2
                                    if(case2==undefined)
                                    {
                                        case2_load=0;
                                        case2_val=0;
                                        case2_point=0;
                                    }
                                    else
                                    {
                                    if(case2!=undefined)
                                    {
                                    if(case2>0 && case2<=2 )
                                    {
                                        case2_load="Up to 2";
                                        case2_val=case2;
                                        case2_point="5";
                                    }
                                    else if(case2>=3 && case2<=5)
                                    {
                                        case2_load="3 to 5";
                                        case2_val=case2;
                                        case2_point="7.5";
                                    }
                                    else if(case2>=6 && case2<=8)
                                    {
                                        case2_load="6 to 8";
                                        case2_val=case2;
                                        case2_point="10";
                                    }
                                    else {
                                        case2_load="0";
                                        case2_val=case2;
                                        case2_point="0";
                                    }
                                }
                            }
                                    /////case 3
                                    
                                    if(case3==undefined)
                                    {
                                        case3_Load=0;
                                        case3_val=0;
                                        case3_point=0;
                                    }
                                    else
                                    {
                                        if(case3!=undefined)
                                    {
                                    if(case3>0 && case3<=6 )
                                    {
                                        case3_Load="Upto 5";
                                        case3_val=case3;
                                        case3_point="2.5";
                                    }
                                    else if(case3>=6 && case3<=10)
                                    {
                                        case3_Load="6 to 10";
                                        case3_val=case3;
                                        case3_point="5";
                                    }
                                    else if(case3>=11 && case1<=15)
                                    {
                                        case3_Load="11 to 15";
                                        case3_val=case3;
                                        case3_point="7.5";
                                    }
                                    else if( case3>=15)
                                    {
                                        case3_Load=">15";
                                        case3_val=case3;
                                        case3_point="10";
                                    }
                                    
                                    else {
                                        case3_Load="0";
                                        case3_val=case3;
                                        case3_point="0";
                                    }
                                }
                            }
                                
                            $scope.total=(Number(case1_point)+Number(case2_point)+Number(case3_point)).toFixed(2);
                                    if($scope.total=="NaN")
                                    $scope.total=0;
                                    
                                    $scope.dataimport=$(
                                        "<tr>"+
                                        "<th>"+org+"</th>"+
                                        "<th>"+specialist_name+"</th>"+
                                        
                                        "<th>"+case1_load+"</th>"+
                                        "<th>"+case1_val+"</th>"+
                                        "<th>"+case1_point+"</th>"+

                                        "<th>"+case2_load+"</th>"+
                                        "<th>"+case2_val+"</th>"+
                                        "<th>"+case2_point+"</th>"+

                                        "<th>"+case3_Load+"</th>"+
                                        "<th>"+case3_val+"</th>"+
                                        "<th>"+case3_point+"</th>"+
                                        
                                        "<th>"+$scope.total+"</th>"+
                                        
                                        
                                        "</tr>"
                                        
                                )
                                }
                               
                                
                            }
                            $("#showdata").append($scope.dataimport);
                        }
                
                    }
////Anaesthetist - PBR monitoring
if(program=="HTCqTWEF1XS" && programname=='Anaesthetist - PBR monitoring')
{
    
           for(var i=0;i<$scope.eventList.length;i++)
           {

            var eveid=$scope.eventList[i];
            $.ajax({
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                async:false,
                url: "../../events/"+eveid+".json",
                 success: function (data) {
                     var teiid=data.trackedEntityInstance;

                     $.ajax({
                        type: "GET",
                        dataType: "json",
                        contentType: "application/json",
                        async:false,
                        url: "../../trackedEntityInstances/"+teiid+".json",
                         success: function (datanew) {
                            
                            for(var jj=0;jj<datanew.attributes.length;jj++)
                            {

                                var val=datanew.attributes[jj].attribute;
                                if(datanew.attributes[jj].attribute=="U0jQjrOkFjR")
                                {
                                    $scope.specialist_name=datanew.attributes[jj].value;
                                }
                            }
        
        
                             
                        }
                    });

                }
            });

            if($scope.specialist_name==undefined)
            {
                $scope.specialist_name="";

            }
                for(var j in $scope.eventDeWiseValueMap)
                {
                   
                    var new_uid=j.split('-');
                    
                    if($scope.eventList[i]==new_uid[0])
                    {
                        var org=getheirarchy($scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'orgunitid']);
                        var event_date=$scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'eventDate'];
                        var case1=$scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'vhG2gN7KaEK'];
                        var case2=$scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'qbgFsR4VWxU'];
                        var case3=$scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'zfMOVN2lc1S'];
                        
                       var case1_load,case1_val,case1_point,
                                    case2_load,case2_val,case2_point,
                                         case3_Load,case3_val,case3_point;
///case 1
                         if(case1==undefined)
                         {
                            case1_load=0;
                            case1_val=0;
                            case1_point=0;
                            
                         }
                         else
                         {
                            if(case1>=6 && case1<=8)
                            {
                                case1_load="6 to 8";
                                case1_val=case1;
                                case1_point="5";
                            }
                             else if(case1>=9 && case1<=11)
                            {
                                case1_load="9 to 11";
                                case1_val=case1;
                                case1_point="7.5";
                            }
                            else if(case1>=12 && case1<=15)
                            {
                                case1_load="12 to 15";
                                case1_val=case1;
                                case1_point="10";
                            }
                            else if( case1>=15)
                            {
                                case1_load=">15";
                                case1_val=case1;
                                case1_point="15";
                            }
                            else 
                            {
                                case1_load="0";
                                case1_val=case1;
                                case1_point="0";
                            }
                            
                         }
                        

///////////case 2
                        if(case2==undefined)
                        {
                            case2_load=0;
                            case2_val=0;
                            case2_point=0;
                        }
                        else
                        {
                        if(case2!=undefined)
                        {
                        if(case2>0 && case2<=2 )
                        {
                            case2_load="Up to 2";
                            case2_val=case2;
                            case2_point="5";
                        }
                        else if(case2>=3 && case2<=5)
                        {
                            case2_load="3 to 5";
                            case2_val=case2;
                            case2_point="7.5";
                        }
                        else if(case2>=6 && case2<=8)
                        {
                            case2_load="6 to 8";
                            case2_val=case2;
                            case2_point="10";
                        }
                        else
                        {
                            case2_load="0";
                            case2_val=case2;
                            case2_point="0";
                        }
                    }
                }
                        /////case 3
                        
                        if(case3==undefined)
                        {
                            case3_Load=0;
                            case3_val=0;
                            case3_point=0;
                        }
                        else
                        {
                            if(case3!=undefined)
                         {
                        if(case3>0 && case3<=6 )
                        {
                            case3_Load="Upto 5";
                            case3_val=case3;
                            case3_point="2.5";
                        }
                        else if(case3>=6 && case3<=10)
                        {
                            case3_Load="6 to 10";
                            case3_val=case3;
                            case3_point="5";
                        }
                        else if(case3>=11 && case1<=15)
                        {
                            case3_Load="11 to 15";
                            case3_val=case3;
                            case3_point="7.5";
                        }
                        else if( case3>=15)
                        {
                            case3_Load=">15";
                            case3_val=case3;
                            case3_point="10";
                        }
                       else 
                        {
                            case3_Load="0";
                            case3_val=case3;
                            case3_point="0";
                        }
                    }
                }
                       var tt=Number(case2_point),ttt=Number(case2_point),ttttt=tt+ttt;
                       
                $scope.total=(Number(case1_point)+Number(case2_point)+Number(case3_point)).toFixed(2);
                        if($scope.total=="NaN")
                        $scope.total=0;
                        
                        $scope.dataimport=$(
                            "<tr>"+
                               "<th>"+event_date+"</th>"+
                               "<th>"+org+"</th>"+
                               "<th>"+$scope.specialist_name+"</th>"+
                               
                               "<th>"+case1_load+"</th>"+
                               "<th>"+case1_val+"</th>"+
                               "<th>"+case1_point+"</th>"+

                               "<th>"+case2_load+"</th>"+
                               "<th>"+case2_val+"</th>"+
                               "<th>"+case2_point+"</th>"+

                               "<th>"+case3_Load+"</th>"+
                               "<th>"+case3_val+"</th>"+
                               "<th>"+case3_point+"</th>"+
                               
                               "<th>"+$scope.total+"</th>"+
                               
                               
                            "</tr>"
                            
                       )
                    }
                   
                    
                }
                $("#showdata").append($scope.dataimport);
                
                
            
           }
        }
        

//////Gynaecologist - PBR monitoring(Aggregated)
if(program=="K3XysZ53B4r"    && programname=="Gynaecologist- PBR monitoring(Aggregated)")
{
    
           for(var i=0;i<$scope.eventList.length;i++)
           {

            var eveid=$scope.eventList[i];
            $.ajax({
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                async:false,
                url: "../../events/"+eveid+".json",
                 success: function (data) {
                     var teiid=data.trackedEntityInstance;

                     $.ajax({
                        type: "GET",
                        dataType: "json",
                        contentType: "application/json",
                        async:false,
                        url: "../../trackedEntityInstances/"+teiid+".json",
                         success: function (datanew) {
                            
                            for(var jj=0;jj<datanew.attributes.length;jj++)
                            {

                                var val=datanew.attributes[jj].attribute;
                                if(datanew.attributes[jj].attribute=="U0jQjrOkFjR")
                                {
                                    $scope.eventDeWiseValueMap[eveid+"-"+datanew.attributes[jj].attribute]=datanew.attributes[jj].value;
                                }
                            }
        
        
                             
                        }
                    });

                }
            });
           }


           
           $scope.neweventval=[];
           var case1=0,case2=0,case3=0;
          

           $scope.keyspresent=[];$scope.keyspresent_val=[];
            for(var j in $scope.eventDeWiseValueMap)
                {
                    
                    if(j.includes('U0jQjrOkFjR'))
                    {
                        $scope.keyspresent[j]=$scope.eventDeWiseValueMap[j];
                        
                    }

                }

                
               
                $scope.duplicateval=[]
                    
                $scope.key=Object.keys($scope.keyspresent);

                var sortable = [];
                for (var d in $scope.keyspresent) {
                    sortable.push([d, $scope.keyspresent[d]]);
                }
                
                $scope.keyspresent=sortable.sort(function(a,b) {return (a[1] > b[1]) ? 1 : ((b[1] > a[1]) ? -1 : 0);} );
                            for(var x =0;x<$scope.keyspresent.length;x++)
                            { 
                               //var h=$scope.keyspresent[x+1][1];
                            if( (x+1)<$scope.keyspresent.length-1)
                            {
                                if($scope.keyspresent[x][1]==$scope.keyspresent[x+1][1] )
                                {
                                     $scope.duplicateval.push($scope.keyspresent[x][1]);
                                     //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                                }
                            }
                               
                            }


                            var new_sortable=[];
                            for(var x=0;x<$scope.keyspresent.length;x++)
                            { 
                                new_sortable[$scope.keyspresent[x][0]]=$scope.keyspresent[x][1];


                            }
                         
                            $scope.keyspresent=new_sortable;
                        
                        $scope.duplicateval = $scope.duplicateval.filter( function( item, index, inputArray ) {
                            return inputArray.indexOf(item) == index;
                            });

                         for(var i=0;i<$scope.duplicateval.length;)
                             {
                            for(var x in $scope.keyspresent)
                            { 
                               
                            
                               if($scope.keyspresent[x]==$scope.duplicateval[i])
                                {
                                    var val1=x.split('-');
                                    $scope.neweventval.push(val1[0]);
                                    //$scope.duplicateval.push($scope.keyspresent[$scope.key[i]]);
                                     //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                                }
                                
                                
                            }
                            i++;
                            $scope.neweventval = $scope.neweventval.filter( function( item, index, inputArray ) {
                                return inputArray.indexOf(item) == index;
                                });

                       
                                if($scope.neweventval.length!=0)
                                {
                                    $scope.FinalEnteredVal=getFinalvalue($scope.eventDeWiseValueMap,$scope.neweventval,$scope.programname); 
                                    
                
                                   var specialist_name=$scope.FinalEnteredVal["U0jQjrOkFjR"];
                                   var org=getheirarchy($scope.FinalEnteredVal['orgunitid']);
                                   
                                   var case1=$scope.FinalEnteredVal["kChiZJPd5je"];
                                   var case2=$scope.FinalEnteredVal["wTdcUXWeqhN"];
                                   var case3=$scope.FinalEnteredVal["eryy31EUorR"];
                                   var case4=$scope.FinalEnteredVal["cqw0HGZQzhD"];
                                   
                                  var case1_load,case1_val,case1_point,
                                               case2_load,case2_val,case2_point,
                                                    case3_Load,case3_val,case3_point
                                                           case4_Load,case4_val,case4_point;
           ///case 1
                                    if(case1==undefined)
                                    {
                                       case1_load=0;
                                       case1_val=0;
                                       case1_point=0;
                                       
                                    }
                                    else
                                    {
                                        
                                       if(case1>=4 && case1<=6)
                                       {
                                           case1_load="4 to 6";
                                           case1_val=case1;
                                           case1_point="2.5";
                                       }
                                       else if(case1>=7 && case1<=9)
                                       {
                                           case1_load="7 to 9";
                                           case1_val=case1;
                                           case1_point="5";
                                       }
                                       else if(case1>=10 && case1<=12)
                                       {
                                           case1_load="10 to 12";
                                           case1_val=case1;
                                           case1_point="7.5";
                                       }
                                       else if( case1>=12)
                                       {
                                           case1_load=">12";
                                           case1_val=case1;
                                           case1_point="15";
                                       }
                                       else
                                       {
                                           case1_load="0";
                                           case1_val=case1;
                                           case1_point="0";
                                       }
                                       
                                    }
                                   
           
           ///////////case 2
                                   if(case2==undefined)
                                   {
                                       case2_load=0;
                                       case2_val=0;
                                       case2_point=0;
                                   }
                                   else
                                   {
                                   if(case2!=undefined)
                                   {
                                    
                                   if(case2>=6 && case2<=8 )
                                   {
                                       case2_load="6 to 8";
                                       case2_val=case2;
                                       case2_point="2.5";
                                   }
                                    else if(case2>=9 && case2<=11)
                                   {
                                       case2_load="9 to 11";
                                       case2_val=case2;
                                       case2_point="5";
                                   }
                                   else if(case2>=12 && case2<=15)
                                   {
                                       case2_load="12 to 15";
                                       case2_val=case2;
                                       case2_point="7.5";
                                   }
                                   else if( case2>=8)
                                   {
                                       case2_load=">15";
                                       case2_val=case2;
                                       case2_point="10";
                                   }
                                   else{
                                    
                                        case2_load="0";
                                        case2_val=case2;
                                        case2_point="0";
                                    
                                   }
                               }
                           }
                                   /////case 3
                                   
                                   if(case3==undefined)
                                   {
                                       case3_Load=0;
                                       case3_val=0;
                                       case3_point=0;
                                   }
                                   else
                                   {
                                       if(case3!=undefined)
                                    {
                                   if(case3<=2 )
                                   {
                                       case3_Load="Upto 2";
                                       case3_val=case3;
                                       case3_point="2.5";
                                   }
                                    else if(case3>=3 && case3<=5)
                                   {
                                       case3_Load="3 to 5";
                                       case3_val=case3;
                                       case3_point="5";
                                   }
                                   else if(case3>=11 && case3<=15)
                                   {
                                       case3_Load="11 to 15";
                                       case3_val=case3;
                                       case3_point="7.5";
                                   }
                                   else if( case3>=8)
                                   {
                                       case3_Load=">8";
                                       case3_val=case3;
                                       case3_point="10";
                                   }
                                   else {
                                    case3_Load="0";
                                    case3_val=case3;
                                    case3_point="0";
                                   }


                               }
                           }
           
           
           
                           //case 4
                           if(case4==undefined)
                                   {
                                       case4_Load=0;
                                       case4_val=0;
                                       case4_point=0;
                                   }
                                   else
                                   {
                                       if(case4!=undefined)
                                    {
                                        
                                   if(case4>=10 && case4<=15)
                                   {
                                       case4_Load="10 to 15 ";
                                       case4_val=case4;
                                       case4_point="2.5";
                                   }
                                   else  if(case4>=3 && case4<=5)
                                   {
                                       case4_Load="16 to 30";
                                       case4_val=case4;
                                       case4_point="5";
                                   }
                                   else if(case4>=11 && case4<=15)
                                   {
                                       case4_Load="31 to 50";
                                       case4_val=case4;
                                       case4_point="7.5";
                                   }
                                   else if( case4>=8)
                                   {
                                       case4_Load=">50";
                                       case4_val=case4;
                                       case4_point="10";
                                   }
                                   else {
                                    case4_Load="0";
                                    case4_val=case4;
                                    case4_point="0";
                                   }
                               }
                           }
                                  
                           $scope.total=(Number(case1_point)+Number(case2_point)+Number(case3_point)+Number(case4_point)).toFixed(2);
                                   if($scope.total=="NaN")
                                   $scope.total=0;
           
                                   $scope.dataimport=$(
                                       "<tr>"+
                                          "<th>"+org+"</th>"+
                                          "<th>"+specialist_name+"</th>"+
                                          
                                          "<th>"+case1_load+"</th>"+
                                          "<th>"+case1_val+"</th>"+
                                          "<th>"+case1_point+"</th>"+
           
                                          "<th>"+case2_load+"</th>"+
                                          "<th>"+case2_val+"</th>"+
                                          "<th>"+case2_point+"</th>"+
           
                                          "<th>"+case3_Load+"</th>"+
                                          "<th>"+case3_val+"</th>"+
                                          "<th>"+case3_point+"</th>"+
           
                                          "<th>"+case4_Load+"</th>"+
                                          "<th>"+case4_val+"</th>"+
                                          "<th>"+case4_point+"</th>"+
                                          
                                          "<th>"+$scope.total+"</th>"+
                                          
                                          
                                       "</tr>"
                                       
                                  )
                                
                                $("#showdata").append($scope.dataimport);
                                }
                               
                                $scope.neweventval=[];
                }

                      
                $scope.duplicateval = $scope.duplicateval.filter( function( item, index, inputArray ) {
                    return inputArray.indexOf(item) == index;
                    });


                $scope.final_keyspresent=[]
                        for(var k in $scope.keyspresent)
                        {
                            $scope.keyspresent_val.push($scope.keyspresent[k]);
                        }
                        $scope.keyspresent_val = $scope.keyspresent_val.sort();
                
                        
                        
                            for(var k=0;k<$scope.duplicateval.length;k++)
                            {
                                for(var jj=$scope.keyspresent_val.length-1;jj>=0;jj--)
                                {
                                    if($scope.duplicateval[k]==$scope.keyspresent_val[jj])
                                    {
                                        $scope.keyspresent_val.splice(jj,1);
                                    
                                    }
                                    
                            }
                            
                        }


                        $scope.final_singleval=[]
                        for(var x in $scope.keyspresent)
                                { 
                                    for(var y=0;y<$scope.keyspresent_val.length;y++)
                                    {
                                        if($scope.keyspresent_val[y]==$scope.keyspresent[x])
                                        {
                                            var val=x.split('-');
                                            $scope.final_singleval.push(val[0]);
                                        }
                                    }

                                }





                                $scope.eventDeWiseValueMap_final=[]
                                 
                                    for(var y=0;y<$scope.final_singleval.length;y++)
                                    {
                                        for(var x in $scope.eventDeWiseValueMap)
                                    {
                                        
                                        var v=x.includes($scope.final_singleval[y]);
                                        if(v)
                                        {
                                            $scope.eventDeWiseValueMap_final[x]=$scope.eventDeWiseValueMap[x];
                                        }

                                }
                            }
                                    

                            

                            for(var i=0;i<$scope.final_singleval.length;i++)
                            {

                            
                            for(var j in $scope.eventDeWiseValueMap_final)
                            {
                               
                                var new_uid=j.split('-');
                                
                                if($scope.final_singleval[i]==new_uid[0])
                                {
                                    var org=getheirarchy($scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'orgunitid']);
                                    var specialist_name=$scope.eventDeWiseValueMap_final[$scope.final_singleval[i]+'-'+'U0jQjrOkFjR'];
                                    
                                    var case1=$scope.eventDeWiseValueMap_final[$scope.final_singleval[i]+'-'+'kChiZJPd5je'];
                                    var case2=$scope.eventDeWiseValueMap_final[$scope.final_singleval[i]+'-'+'wTdcUXWeqhN'];
                                    var case3=$scope.eventDeWiseValueMap_final[$scope.final_singleval[i]+'-'+'eryy31EUorR'];
                                    var case4=$scope.eventDeWiseValueMap_final[$scope.final_singleval[i]+'-'+'cqw0HGZQzhD'];
                                    
                                   
                                     
                                   var case1_load,case1_val,case1_point,
                                                case2_load,case2_val,case2_point,
                                                     case3_Load,case3_val,case3_point
                                                            case4_Load,case4_val,case4_point;
                                            ///case 1
                                            if(case1==undefined)
                                            {
                                                case1_load=0;
                                                case1_val=0;
                                                case1_point=0;
                                                
                                            }
                                            else
                                            {
                                                
                                                if(case1>=4 && case1<=6)
                                                {
                                                    case1_load="4 to 6";
                                                    case1_val=case1;
                                                    case1_point="2.5";
                                                }
                                                else if(case1>=7 && case1<=9)
                                                {
                                                    case1_load="7 to 9";
                                                    case1_val=case1;
                                                    case1_point="5";
                                                }
                                                else if(case1>=10 && case1<=12)
                                                {
                                                    case1_load="10 to 12";
                                                    case1_val=case1;
                                                    case1_point="7.5";
                                                }
                                                else if( case1>=12)
                                                {
                                                    case1_load=">12";
                                                    case1_val=case1;
                                                    case1_point="15";
                                                }
                                                else
                                                {
                                                    case1_load="0";
                                                    case1_val=case1;
                                                    case1_point="0";
                                                }
                                                
                                            }
                                            

                                    ///////////case 2
                                            if(case2==undefined)
                                            {
                                                case2_load=0;
                                                case2_val=0;
                                                case2_point=0;
                                            }
                                            else
                                            {
                                            if(case2!=undefined)
                                            {
                                            
                                            if(case2>=6 && case2<=8 )
                                            {
                                                case2_load="6 to 8";
                                                case2_val=case2;
                                                case2_point="2.5";
                                            }
                                            else if(case2>=9 && case2<=11)
                                            {
                                                case2_load="9 to 11";
                                                case2_val=case2;
                                                case2_point="5";
                                            }
                                            else if(case2>=12 && case2<=15)
                                            {
                                                case2_load="12 to 15";
                                                case2_val=case2;
                                                case2_point="7.5";
                                            }
                                            else if( case2>=8)
                                            {
                                                case2_load=">15";
                                                case2_val=case2;
                                                case2_point="10";
                                            }
                                            else{
                                            
                                                case2_load="0";
                                                case2_val=case2;
                                                case2_point="0";
                                            
                                            }
                                        }
                                    }
                                            /////case 3
                                            
                                            if(case3==undefined)
                                            {
                                                case3_Load=0;
                                                case3_val=0;
                                                case3_point=0;
                                            }
                                            else
                                            {
                                                if(case3!=undefined)
                                            {
                                            if(case3<=2 )
                                            {
                                                case3_Load="Upto 2";
                                                case3_val=case3;
                                                case3_point="2.5";
                                            }
                                            else if(case3>=3 && case3<=5)
                                            {
                                                case3_Load="3 to 5";
                                                case3_val=case3;
                                                case3_point="5";
                                            }
                                            else if(case3>=11 && case3<=15)
                                            {
                                                case3_Load="11 to 15";
                                                case3_val=case3;
                                                case3_point="7.5";
                                            }
                                            else if( case3>=8)
                                            {
                                                case3_Load=">8";
                                                case3_val=case3;
                                                case3_point="10";
                                            }
                                            else {
                                            case3_Load="0";
                                            case3_val=case3;
                                            case3_point="0";
                                            }


                                        }
                                    }



                                    //case 4
                                    if(case4==undefined)
                                            {
                                                case4_Load=0;
                                                case4_val=0;
                                                case4_point=0;
                                            }
                                            else
                                            {
                                                if(case4!=undefined)
                                            {
                                                
                                            if(case4>=10 && case4<=15)
                                            {
                                                case4_Load="10 to 15 ";
                                                case4_val=case4;
                                                case4_point="2.5";
                                            }
                                            else  if(case4>=3 && case4<=5)
                                            {
                                                case4_Load="16 to 30";
                                                case4_val=case4;
                                                case4_point="5";
                                            }
                                            else if(case4>=11 && case4<=15)
                                            {
                                                case4_Load="31 to 50";
                                                case4_val=case4;
                                                case4_point="7.5";
                                            }
                                            else if( case4>=8)
                                            {
                                                case4_Load=">50";
                                                case4_val=case4;
                                                case4_point="10";
                                            }
                                            else {
                                            case4_Load="0";
                                            case4_val=case4;
                                            case4_point="0";
                                            }
                                        }
                                    }
                                   
                            $scope.total=(Number(case1_point)+Number(case2_point)+Number(case3_point)+Number(case4_point)).toFixed(2);
                                    if($scope.total=="NaN")
                                    $scope.total=0;
            
                                    $scope.dataimport=$(
                                        "<tr>"+
                                           "<th>"+org+"</th>"+
                                           "<th>"+specialist_name+"</th>"+
                                          
                                           "<th>"+case1_load+"</th>"+
                                           "<th>"+case1_val+"</th>"+
                                           "<th>"+case1_point+"</th>"+
            
                                           "<th>"+case2_load+"</th>"+
                                           "<th>"+case2_val+"</th>"+
                                           "<th>"+case2_point+"</th>"+
            
                                           "<th>"+case3_Load+"</th>"+
                                           "<th>"+case3_val+"</th>"+
                                           "<th>"+case3_point+"</th>"+
            
                                           "<th>"+case4_Load+"</th>"+
                                           "<th>"+case4_val+"</th>"+
                                           "<th>"+case4_point+"</th>"+
                                           
                                           "<th>"+$scope.total+"</th>"+
                                           
                                           
                                        "</tr>"
                                        
                                   )
                                }
                               
                                
                            }
                            $("#showdata").append($scope.dataimport);
                        }
                
                    }
        
//Gynaecologist - PBR monitoring
        if(program=="K3XysZ53B4r"    && programname=="Gynaecologist - PBR monitoring")
        {
            for(var i=0;i<$scope.eventList.length;i++)
           {
            var eveid=$scope.eventList[i];
            $.ajax({
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                async:false,
                url: "../../events/"+eveid+".json",
                 success: function (data) {
                     var teiid=data.trackedEntityInstance;

                     $.ajax({
                        type: "GET",
                        dataType: "json",
                        contentType: "application/json",
                        async:false,
                        url: "../../trackedEntityInstances/"+teiid+".json",
                         success: function (datanew) {
                            
                            for(var jj=0;jj<datanew.attributes.length;jj++)
                            {

                                var val=datanew.attributes[jj].attribute;
                                if(datanew.attributes[jj].attribute=="U0jQjrOkFjR")
                                {
                                    $scope.specialist_name=datanew.attributes[jj].value;
                                }
                            }
        
        
                             
                        }
                    });

                }
            });

            if($scope.specialist_name==undefined)
            {
                $scope.specialist_name="";

            }
               
                for(var j in $scope.eventDeWiseValueMap)
                {
                   
                    var new_uid=j.split('-');
                    
                    if($scope.eventList[i]==new_uid[0])
                    {
                        var org=getheirarchy($scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'orgunitid']);
                        var event_date=$scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'eventDate'];
                        var case1=$scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'kChiZJPd5je'];
                        var case2=$scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'wTdcUXWeqhN'];
                        var case3=$scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'eryy31EUorR'];
                        var case4=$scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'cqw0HGZQzhD'];
                        
                       var case1_load,case1_val,case1_point,
                                    case2_load,case2_val,case2_point,
                                         case3_Load,case3_val,case3_point
                                                case4_Load,case4_val,case4_point;
///case 1
                         if(case1==undefined)
                         {
                            case1_load=0;
                            case1_val=0;
                            case1_point=0;
                            
                         }
                         else
                         {
                            if(case1>=4 && case1<=6)
                            {
                                case1_load="4 to 6";
                                case1_val=case1;
                                case1_point="2.5";
                            }
                            else if(case1>=7 && case1<=9)
                            {
                                case1_load="7 to 9";
                                case1_val=case1;
                                case1_point="5";
                            }
                            else if(case1>=10 && case1<=12)
                            {
                                case1_load="10 to 12";
                                case1_val=case1;
                                case1_point="7.5";
                            }
                            else if( case1>=12)
                            {
                                case1_load=">12";
                                case1_val=case1;
                                case1_point="15";
                            }
                            else {
                                case1_load="0";
                                case1_val=case1;
                                case1_point="0";
                            }
                            
                         }
                        

///////////case 2
                        if(case2==undefined)
                        {
                            case2_load=0;
                            case2_val=0;
                            case2_point=0;
                        }
                        else
                        {
                        if(case2!=undefined)
                        {
                        if(case2>=6 && case2<=8 )
                        {
                            case2_load="6 to 8";
                            case2_val=case2;
                            case2_point="2.5";
                        }
                        else  if(case2>=9 && case2<=11)
                        {
                            case2_load="9 to 11";
                            case2_val=case2;
                            case2_point="5";
                        }
                        else if(case2>=12 && case2<=15)
                        {
                            case2_load="12 to 15";
                            case2_val=case2;
                            case2_point="7.5";
                        }
                        else if( case2>=8)
                        {
                            case2_load=">15";
                            case2_val=case2;
                            case2_point="10";
                        }
                        else {
                            case2_load="0";
                            case2_val=case2;
                            case2_point="0";
                        }
                    }
                }
                        /////case 3
                        
                        if(case3==undefined)
                        {
                            case3_Load=0;
                            case3_val=0;
                            case3_point=0;
                        }
                        else
                        {
                            if(case3!=undefined)
                         {
                        if(case3<=2 )
                        {
                            case3_Load="Upto 2";
                            case3_val=case3;
                            case3_point="2.5";
                        }
                        else  if(case3>=3 && case3<=5)
                        {
                            case3_Load="3 to 5";
                            case3_val=case3;
                            case3_point="5";
                        }
                        else if(case3>=11 && case3<=15)
                        {
                            case3_Load="11 to 15";
                            case3_val=case3;
                            case3_point="7.5";
                        }
                        else if( case3>=8)
                        {
                            case3_Load=">8";
                            case3_val=case3;
                            case3_point="10";
                        }
                        else {
                            case3_Load="0";
                            case3_val=case3;
                            case3_point="0";
                        }
                    }
                }



                //case 4
                if(case4==undefined)
                        {
                            case4_Load=0;
                            case4_val=0;
                            case4_point=0;
                        }
                        else
                        {
                            if(case4!=undefined)
                         {
                        if(case4>=10 && case4<=15)
                        {
                            case4_Load="10 to 15 ";
                            case4_val=case4;
                            case4_point="2.5";
                        }
                         else if(case4>=3 && case4<=5)
                        {
                            case4_Load="16 to 30";
                            case4_val=case4;
                            case4_point="5";
                        }
                        else if(case4>=11 && case4<=15)
                        {
                            case4_Load="31 to 50";
                            case4_val=case4;
                            case4_point="7.5";
                        }
                        else if( case4>=8)
                        {
                            case4_Load=">50";
                            case4_val=case4;
                            case4_point="10";
                        }
                        else {
                            case4_Load="0";
                            case4_val=case4;
                            case4_point="0";
                        }
                    }
                }
                       
                $scope.total=(Number(case1_point)+Number(case2_point)+Number(case3_point)+Number(case4_point)).toFixed(2);
                        if($scope.total=="NaN")
                        $scope.total=0;

                        $scope.dataimport=$(
                            "<tr>"+
                               "<th>"+event_date+"</th>"+
                               "<th>"+org+"</th>"+
                               "<th>"+$scope.specialist_name+"</th>"+
                               "<th>"+case1_load+"</th>"+
                               "<th>"+case1_val+"</th>"+
                               "<th>"+case1_point+"</th>"+

                               "<th>"+case2_load+"</th>"+
                               "<th>"+case2_val+"</th>"+
                               "<th>"+case2_point+"</th>"+

                               "<th>"+case3_Load+"</th>"+
                               "<th>"+case3_val+"</th>"+
                               "<th>"+case3_point+"</th>"+

                               "<th>"+case4_Load+"</th>"+
                               "<th>"+case4_val+"</th>"+
                               "<th>"+case4_point+"</th>"+
                               
                               "<th>"+$scope.total+"</th>"+
                               
                               
                            "</tr>"
                            
                       )
                    }
                   
                    
                }
                $("#showdata").append($scope.dataimport);
                
                
            
           }
        }



//////programname=="Paediatric - PBR monitoring(aggregrated)
        if(programname=="Paediatric- PBR monitoring(Aggregated)" && new_psuid=="PfRIIrvnjcU")
{
    
           for(var i=0;i<$scope.eventList.length;i++)
           {

            var eveid=$scope.eventList[i];
            $.ajax({
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                async:false,
                url: "../../events/"+eveid+".json",
                 success: function (data) {
                     var teiid=data.trackedEntityInstance;

                     $.ajax({
                        type: "GET",
                        dataType: "json",
                        contentType: "application/json",
                        async:false,
                        url: "../../trackedEntityInstances/"+teiid+".json",
                         success: function (datanew) {
                            
                            for(var jj=0;jj<datanew.attributes.length;jj++)
                            {

                                var val=datanew.attributes[jj].attribute;
                                if(datanew.attributes[jj].attribute=="U0jQjrOkFjR")
                                {
                                    $scope.eventDeWiseValueMap[eveid+"-"+datanew.attributes[jj].attribute]=datanew.attributes[jj].value;
                                }
                            }
        
        
                             
                        }
                    });

                }
            });
           }


           
           $scope.neweventval=[];
           var case1=0,case2=0,case3=0;
          

           $scope.keyspresent=[];$scope.keyspresent_val=[];
            for(var j in $scope.eventDeWiseValueMap)
                {
                    
                    if(j.includes('U0jQjrOkFjR'))
                    {
                        $scope.keyspresent[j]=$scope.eventDeWiseValueMap[j];
                        
                    }

                }

                
               
                $scope.duplicateval=[]
                    
                $scope.key=Object.keys($scope.keyspresent);

                var sortable = [];
                for (var d in $scope.keyspresent) {
                    sortable.push([d, $scope.keyspresent[d]]);
                }
                
                $scope.keyspresent=sortable.sort(function(a,b) {return (a[1] > b[1]) ? 1 : ((b[1] > a[1]) ? -1 : 0);} );
                            for(var x =0;x<$scope.keyspresent.length;x++)
                            { 
                               //var h=$scope.keyspresent[x+1][1];
                            if( (x+1)<$scope.keyspresent.length-1)
                            {
                                if($scope.keyspresent[x][1]==$scope.keyspresent[x+1][1] )
                                {
                                     $scope.duplicateval.push($scope.keyspresent[x][1]);
                                     //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                                }
                            }
                               
                            }


                            var new_sortable=[];
                            for(var x=0;x<$scope.keyspresent.length;x++)
                            { 
                                new_sortable[$scope.keyspresent[x][0]]=$scope.keyspresent[x][1];


                            }
                         
                            $scope.keyspresent=new_sortable;
                            
                            $scope.duplicateval = $scope.duplicateval.filter( function( item, index, inputArray ) {
                                return inputArray.indexOf(item) == index;
                                });

                             for(var i=0;i<$scope.duplicateval.length;)
                                 {
                                for(var x in $scope.keyspresent)
                                { 
                                   
                                
                                   if($scope.keyspresent[x]==$scope.duplicateval[i])
                                    {
                                        var val1=x.split('-');
                                        $scope.neweventval.push(val1[0]);
                                        //$scope.duplicateval.push($scope.keyspresent[$scope.key[i]]);
                                         //hh= $scope.keyspresent.splice($scope.key[i+1],1);
                                    }
                                    
                                    
                                }
                                i++;
                                $scope.neweventval = $scope.neweventval.filter( function( item, index, inputArray ) {
                                    return inputArray.indexOf(item) == index;
                                    });
                       
                                if($scope.neweventval.length!=0)
                                {
                                    $scope.FinalEnteredVal=getFinalvalue($scope.eventDeWiseValueMap,$scope.neweventval,$scope.programname); 
                                    
                                   var specialist_name=$scope.FinalEnteredVal['U0jQjrOkFjR'];
                                   var org=getheirarchy($scope.FinalEnteredVal['orgunitid']);
                                  
                                   var case1=$scope.FinalEnteredVal['hTXa7qrYv3u'];
                                   var case2=$scope.FinalEnteredVal['vhG2gN7KaEK'];
                                  
                                   var case3_value1=$scope.FinalEnteredVal['zXdqhofvW2r'];
                                   if(case3_value1 == undefined )
                                   case3_value1=0;

                                   var case3_value2=$scope.FinalEnteredVal['ZZleevtpH87'];
                                   if( case3_value2 == undefined)
                                   case3_value2=0;

                                    var case3=((case3_value1/case3_value2)*100).toFixed(2);
                                    
                                                      
                                   var case4_value1_num=$scope.FinalEnteredVal['yQELYdrwRXg'];
                                   if( case4_value1_num == undefined)
                                   case4_value1_num=0;
                                   var case4_value2_num=$scope.FinalEnteredVal['jBlJz2IMl1S'];
                                   if( case4_value2_num == undefined)
                                   case4_value2_num=0;
                                   var case4_value3_num=$scope.FinalEnteredVal['DZMhZgqgKJa'];
                                   if( case4_value3_num == undefined)
                                   case4_value3_num=0;
                                   var case4_value1_dem=$scope.FinalEnteredVal['o1CRenXyXWt'];
                                   if( case4_value1_dem == undefined)
                                   case4_value1_dem=0;
                                   var case4_value2_dem=$scope.FinalEnteredVal['dq0j1v6wMhZ'];
                                   if( case4_value2_dem == undefined)
                                   case4_value2_dem=0;
                                   var case4_value3_dem=$scope.FinalEnteredVal['cvwppxdbycu'];
                                   if( case4_value3_dem == undefined)
                                   case4_value3_dem=0;
                                    var case4=(((case4_value1_num+case4_value2_num+case4_value3_num)/(case4_value1_dem+case4_value2_dem+case4_value3_dem))*100).toFixed(2);
                                    
                                   var case5=$scope.FinalEnteredVal['fmgq14VGiJ8'];
                                  var case1_load,case1_val,case1_point,
                                               case2_load,case2_val,case2_point,
                                                    case3_Load,case3_val,case3_point,
                                                           case4_Load,case4_val,case4_point,
                                                              case5_Load,case5_val,case5_point;
           ///case 1
                                    if(case1==undefined)
                                    {
                                       case1_load=0;
                                       case1_val=0;
                                       case1_point=0;
                                       
                                    }
                                    else
                                    {
                                       if(case1<=300)
                                       {
                                           case1_load="<300";
                                           case1_val=case1;
                                           case1_point="2.5";
                                       }
                                       else if(case1>=301 && case1<=375)
                                       {
                                           case1_load="301 to 375";
                                           case1_val=case1;
                                           case1_point="5";
                                       }
                                       else if(case1>=376 && case1<=450)
                                       {
                                           case1_load="376 to 450";
                                           case1_val=case1;
                                           case1_point="7.5";
                                       }
                                       else if( case1>=450)
                                       {
                                           case1_load=">450";
                                           case1_val=case1;
                                           case1_point="10";
                                       }
                                       else 
                                       {
                                           case1_load="0";
                                           case1_val=case1;
                                           case1_point="0";
                                       }
                                       
                                    }
                                   
           
           ///////////case 2
                                   if(case2==undefined)
                                   {
                                       case2_load=0;
                                       case2_val=0;
                                       case2_point=0;
                                   }
                                   else
                                   {
                                   if(case2!=undefined)
                                   {
                                   if(case2<=2 )
                                   {
                                       case2_load="<2";
                                       case2_val=case2;
                                       case2_point="2.5";
                                   }
                                   else if(case2>=2 && case2<=5)
                                   {
                                       case2_load="2 to 5";
                                       case2_val=case2;
                                       case2_point="5";
                                   }
                                   else if(case2>=6 && case2<=10)
                                   {
                                       case2_load="6 to 10";
                                       case2_val=case2;
                                       case2_point="7.5";
                                   }
                                   else if( case2>=10)
                                   {
                                       case2_load=">10";
                                       case2_val=case2;
                                       case2_point="10";
                                   }
                                   else 
                                   {
                                       case2_load="0";
                                       case2_val=case2;
                                       case2_point="0";
                                   }
                               }
                           }
                                   /////case 3
                                   
                                   if(case3==undefined)
                                   {
                                       case3_Load=0;
                                       case3_val=0;
                                       case3_point=0;
                                   }
                                   else
                                   {
                                       if(case3!=undefined)
                                    {
                                   if(case3<=25 )
                                   {
                                       case3_Load="Upto 25%";
                                       case3_val=case3;
                                       case3_point="2.5";
                                   }
                                    else if(case3>=26 && case3<=50)
                                   {
                                       case3_Load="25% to 50%";
                                       case3_val=case3;
                                       case3_point="5";
                                   }
                                   else if(case3>=51 && case3<=75)
                                   {
                                       case3_Load="50% to 75%";
                                       case3_val=case3;
                                       case3_point="3.75";
                                   }
                                   else if( case3>=100)
                                   {
                                       case3_Load=">100%";
                                       case3_val=case3;
                                       case3_point="5";
                                   }
                                   else if(case3==="NaN")
                                   {
                                    case3_Load="0";
                                    case3_val="0";
                                    case3_point="0"; 
                                   }
                                   else 
                                   {
                                    case3_Load="0";
                                    case3_val=case3;
                                    case3_point="0";
                                   }
                               }
                           }
           
           
           
                           //case 4
                           if(case4==undefined)
                                   {
                                       case4_Load=0;
                                       case4_val=0;
                                       case4_point=0;
                                   }
                                   else
                                   {
                                       if(case4!=undefined)
                                    {
                                   if(case4<=25)
                                   {
                                       case4_Load="upto 25% ";
                                       case4_val=case4;
                                       case4_point="1.25";
                                   }
                                   else if(case4>=25 && case4<=50)
                                   {
                                       case4_Load="25 to 50";
                                       case4_val=case4;
                                       case4_point="2.5";
                                   }
                                   else if(case4>=51 && case4<=75)
                                   {
                                       case4_Load="50% to 75%";
                                       case4_val=case4;
                                       case4_point="3.75";
                                   }
                                   else if( case4>=8)
                                   {
                                       case4_Load=">100%";
                                       case4_val=case4;
                                       case4_point="5";
                                   }
                                   else if(case4==="NaN")
                                   {
                                    case4_Load="0";
                                    case4_val="0";
                                    case4_point="0";
                                   }
                                   else 
                                   {
                                    case4_Load="0";
                                    case4_val=case4;
                                    case4_point="0";
                                   }
                               }
                           }
           
           
                           //case 5
                           if(case5==undefined)
                                   {
                                       case5_Load=0,case5_val=0,case5_point=0;
                                   }
                                   else
                                   {
                                       if(case4!=undefined)
                                    {
                                       case5_Load="",case5_val=case5,case5_point=0;
                               }
                           }
                                  
                           
                           $scope.total=(Number(case1_point)+Number(case2_point)+Number(case3_point)+Number(case4_point)+Number(case5_point)).toFixed(2);
                                   if($scope.total=="NaN")
                                   $scope.total=0;
           
                                   $scope.dataimport=$(
                                       "<tr>"+
                                       "<th>"+org+"</th>"+
                                        "<th>"+specialist_name+"</th>"+
                                          
                                          "<th>"+case1_load+"</th>"+
                                          "<th>"+case1_val+"</th>"+
                                          "<th>"+case1_point+"</th>"+
           
                                          "<th>"+case2_load+"</th>"+
                                          "<th>"+case2_val+"</th>"+
                                          "<th>"+case2_point+"</th>"+
           
                                          "<th>"+case3_Load+"</th>"+
                                          "<th>"+case3_val+"</th>"+
                                          "<th>"+case3_point+"</th>"+
           
                                          "<th>"+case4_Load+"</th>"+
                                          "<th>"+case4_val+"</th>"+
                                          "<th>"+case4_point+"</th>"+
           
                                          "<th>"+case5_Load+"</th>"+
                                          "<th>"+case5_val+"</th>"+
                                          "<th>"+case5_point+"</th>"+
                                          
                                          "<th>"+$scope.total+"</th>"+
                                          
                                          
                                       "</tr>"
                                       
                                  )
                                
                                $("#showdata").append($scope.dataimport);
                                }
                                
                               
                                $scope.neweventval=[];
                }

                $scope.duplicateval = $scope.duplicateval.filter( function( item, index, inputArray ) {
                    return inputArray.indexOf(item) == index;
                    });


                $scope.final_keyspresent=[]
                        for(var k in $scope.keyspresent)
                        {
                            $scope.keyspresent_val.push($scope.keyspresent[k]);
                        }
                        $scope.keyspresent_val = $scope.keyspresent_val.sort();
                
                        var hhhh=[];
                        
                            for(var k=0;k<$scope.duplicateval.length;k++)
                            {
                                for(var jj=$scope.keyspresent_val.length-1;jj>=0;jj--)
                                {
                                    if($scope.duplicateval[k]==$scope.keyspresent_val[jj])
                                    {
                                        $scope.keyspresent_val.splice(jj,1);
                                    
                                    }
                                    
                            }
                            
                        }

                        

                        $scope.final_singleval=[]
                        for(var x in $scope.keyspresent)
                                { 
                                    for(var y=0;y<$scope.keyspresent_val.length;y++)
                                    {
                                        if($scope.keyspresent_val[y]==$scope.keyspresent[x])
                                        {
                                            var val=x.split('-');
                                            $scope.final_singleval.push(val[0]);
                                        }
                                    }

                                }





                                $scope.eventDeWiseValueMap_final=[]
                                 
                                    for(var y=0;y<$scope.final_singleval.length;y++)
                                    {
                                        for(var x in $scope.eventDeWiseValueMap)
                                    {
                                        
                                        var v=x.includes($scope.final_singleval[y]);
                                        if(v)
                                        {
                                            $scope.eventDeWiseValueMap_final[x]=$scope.eventDeWiseValueMap[x];
                                        }

                                }
                            }
                                    

                            

                            for(var i=0;i<$scope.final_singleval.length;i++)
                            {

                            
                            for(var j in $scope.eventDeWiseValueMap_final)
                            {
                               
                                var new_uid=j.split('-');
                                
                                if($scope.final_singleval[i]==new_uid[0])
                                {
                                   
                                    var specialist_name=$scope.FinalEnteredVal['U0jQjrOkFjR'];
                                    var org=getheirarchy($scope.FinalEnteredVal['orgunitid']);
                                  
                                   var case1=$scope.FinalEnteredVal['hTXa7qrYv3u'];
                                   var case2=$scope.FinalEnteredVal['vhG2gN7KaEK'];
                                  
                                   var case3_value1=$scope.FinalEnteredVal['zXdqhofvW2r'];
                                   if(case3_value1 == undefined )
                                   case3_value1=0;

                                   var case3_value2=$scope.FinalEnteredVal['ZZleevtpH87'];
                                   if( case3_value2 == undefined)
                                   case3_value2=0;

                                    var case3=((case3_value1/case3_value2)*100).toFixed(2);
                                    
                                                      
                                   var case4_value1_num=$scope.FinalEnteredVal['yQELYdrwRXg'];
                                   if( case4_value1_num == undefined)
                                   case4_value1_num=0;
                                   var case4_value2_num=$scope.FinalEnteredVal['jBlJz2IMl1S'];
                                   if( case4_value2_num == undefined)
                                   case4_value2_num=0;
                                   var case4_value3_num=$scope.FinalEnteredVal['DZMhZgqgKJa'];
                                   if( case4_value3_num == undefined)
                                   case4_value3_num=0;
                                   var case4_value1_dem=$scope.FinalEnteredVal['o1CRenXyXWt'];
                                   if( case4_value1_dem == undefined)
                                   case4_value1_dem=0;
                                   var case4_value2_dem=$scope.FinalEnteredVal['dq0j1v6wMhZ'];
                                   if( case4_value2_dem == undefined)
                                   case4_value2_dem=0;
                                   var case4_value3_dem=$scope.FinalEnteredVal['cvwppxdbycu'];
                                   if( case4_value3_dem == undefined)
                                   case4_value3_dem=0;
                                
                                   var case4=(((case4_value1_num+case4_value2_num+case4_value3_num)/(case4_value1_dem+case4_value2_dem+case4_value3_dem))*100).toFixed(2);
                                    
                                    var case5=$scope.eventDeWiseValueMap_final[$scope.final_singleval[i]+'-'+'fmgq14VGiJ8'];
                                   var case1_load,case1_val,case1_point,
                                                case2_load,case2_val,case2_point,
                                                     case3_Load,case3_val,case3_point,
                                                            case4_Load,case4_val,case4_point,
                                                               case5_Load,case5_val,case5_point;
            ///case 1
                                     if(case1==undefined)
                                     {
                                        case1_load=0;
                                        case1_val=0;
                                        case1_point=0;
                                        
                                     }
                                     else
                                     {
                                        if(case1<=300)
                                        {
                                            case1_load="<300";
                                            case1_val=case1;
                                            case1_point="2.5";
                                        }
                                        else if(case1>=301 && case1<=375)
                                        {
                                            case1_load="301 to 375";
                                            case1_val=case1;
                                            case1_point="5";
                                        }
                                        else if(case1>=376 && case1<=450)
                                        {
                                            case1_load="376 to 450";
                                            case1_val=case1;
                                            case1_point="7.5";
                                        }
                                        else if( case1>=450)
                                        {
                                            case1_load=">450";
                                            case1_val=case1;
                                            case1_point="10";
                                        }
                                        else{
                                            case1_load="0";
                                            case1_val=case1;
                                            case1_point="0";
                                        }
                                     }
                                    
            
            ///////////case 2
                                    if(case2==undefined)
                                    {
                                        case2_load=0;
                                        case2_val=0;
                                        case2_point=0;
                                    }
                                    else
                                    {
                                    if(case2!=undefined)
                                    {
                                    if(case2<=2 )
                                    {
                                        case2_load="<2";
                                        case2_val=case2;
                                        case2_point="2.5";
                                    }
                                    else if(case2>=2 && case2<=5)
                                    {
                                        case2_load="2 to 5";
                                        case2_val=case2;
                                        case2_point="5";
                                    }
                                    else if(case2>=6 && case2<=10)
                                    {
                                        case2_load="6 to 10";
                                        case2_val=case2;
                                        case2_point="7.5";
                                    }
                                    else if( case2>=10)
                                    {
                                        case2_load=">10";
                                        case2_val=case2;
                                        case2_point="10";
                                    }
                                    else {
                                        case2_load="0";
                                        case2_val=case2;
                                        case2_point="0";
                                    }
                                }
                            }
                                    /////case 3
                                    
                                    if(case3==undefined)
                                    {
                                        case3_Load=0;
                                        case3_val=0;
                                        case3_point=0;
                                    }
                                    else
                                    {
                                        if(case3!=undefined)
                                     {
                                    if(case3<=25 )
                                    {
                                        case3_Load="Upto 25%";
                                        case3_val=case3;
                                        case3_point="2.5";
                                    }
                                    else if(case3>=26 && case3<=50)
                                    {
                                        case3_Load="25% to 50%";
                                        case3_val=case3;
                                        case3_point="5";
                                    }
                                    else if(case3>=51 && case3<=75)
                                    {
                                        case3_Load="50% to 75%";
                                        case3_val=case3;
                                        case3_point="3.75";
                                    }
                                    else if( case3>=100)
                                    {
                                        case3_Load=">100%";
                                        case3_val=case3;
                                        case3_point="5";
                                    }
                                    else {
                                        case3_Load="0";
                                        case3_val=case3;
                                        case3_point="0";
                                    }
                                }
                            }
            
            
            
                            //case 4
                            if(case4==undefined)
                                    {
                                        case4_Load=0;
                                        case4_val=0;
                                        case4_point=0;
                                    }
                                    else
                                    {
                                        if(case4!=undefined)
                                     {
                                    if(case4<=25)
                                    {
                                        case4_Load="upto 25% ";
                                        case4_val=case4;
                                        case4_point="1.25";
                                    }
                                    else if(case4>=25 && case4<=50)
                                    {
                                        case4_Load="25 to 50";
                                        case4_val=case4;
                                        case4_point="2.5";
                                    }
                                    else if(case4>=51 && case4<=75)
                                    {
                                        case4_Load="50% to 75%";
                                        case4_val=case4;
                                        case4_point="3.75";
                                    }
                                    else if( case4>=8)
                                    {
                                        case4_Load=">100%";
                                        case4_val=case4;
                                        case4_point="5";
                                    }
                                    else{
                                        case4_Load="0";
                                        case4_val=case4;
                                        case4_point="0";
                                    }
                                }
                            }
            
            
                            //case 5
                            if(case5==undefined)
                                    {
                                        case5_Load=0,case5_val=0,case5_point=0;
                                    }
                                    else
                                    {
                                        if(case4!=undefined)
                                     {
                                        case5_Load="",case5_val=case5,case5_point=0;
                                }
                            }
                                   
                            
                            $scope.total=(Number(case1_point)+Number(case2_point)+Number(case3_point)+Number(case4_point)+Number(case5_point)).toFixed(2);
                                   if($scope.total=="NaN")
                                    $scope.total=0;
            
                                    $scope.dataimport=$(
                                        "<tr>"+
                                            "<th>"+org+"</th>"+
                                            
                                            "<th>"+specialist_name+"</th>"+
                                            
                                            "<th>"+case1_load+"</th>"+
                                           "<th>"+case1_val+"</th>"+
                                           "<th>"+case1_point+"</th>"+
            
                                           "<th>"+case2_load+"</th>"+
                                           "<th>"+case2_val+"</th>"+
                                           "<th>"+case2_point+"</th>"+
            
                                           "<th>"+case3_Load+"</th>"+
                                           "<th>"+case3_val+"</th>"+
                                           "<th>"+case3_point+"</th>"+
            
                                           "<th>"+case4_Load+"</th>"+
                                           "<th>"+case4_val+"</th>"+
                                           "<th>"+case4_point+"</th>"+
            
                                           "<th>"+case5_Load+"</th>"+
                                           "<th>"+case5_val+"</th>"+
                                           "<th>"+case5_point+"</th>"+
                                           
                                           "<th>"+$scope.total+"</th>"+
                                           
                                           
                                        "</tr>"
                                        
                                   )
                                }
                               
                                
                            }
                            $("#showdata").append($scope.dataimport);
                        }
                
                    }
        
///Paediatric - PBR monitoring
//'idDnTQcDA3o',	'OZUfNtngt0T',	'ZmlLbYwR1Zm',	'Z3jhwUgahdh',	'C1Hr5tSOFhO',	'wmoYsnIYwXp',	'zXdqhofvW2r',	'PTDWef0EKBH',	'ZZleevtpH87',	'yQELYdrwRXg',	'jBlJz2IMl1S',	'DZMhZgqgKJa',	'fmgq14VGiJ8',	'hTXa7qrYv3u',	'CCNnr8s3rgE',	'o1CRenXyXWt',	'dq0j1v6wMhZ',	'cvwppxdbycu',

        if(programname=="Paediatric - PBR monitoring" && new_psuid=="PfRIIrvnjcU")
        {
            for(var i=0;i<$scope.eventList.length;i++)
           {
            var eveid=$scope.eventList[i];
            $.ajax({
                type: "GET",
                dataType: "json",
                contentType: "application/json",
                async:false,
                url: "../../events/"+eveid+".json",
                 success: function (data) {
                     var teiid=data.trackedEntityInstance;

                     $.ajax({
                        type: "GET",
                        dataType: "json",
                        contentType: "application/json",
                        async:false,
                        url: "../../trackedEntityInstances/"+teiid+".json",
                         success: function (datanew) {
                            
                            for(var jj=0;jj<datanew.attributes.length;jj++)
                            {

                                var val=datanew.attributes[jj].attribute;
                                if(datanew.attributes[jj].attribute=="U0jQjrOkFjR")
                                {
                                    $scope.specialist_name=datanew.attributes[jj].value;
                                }
                            }
        
        
                             
                        }
                    });

                }
            });

            if($scope.specialist_name==undefined)
            {
                $scope.specialist_name="";

            }
               
                for(var j in $scope.eventDeWiseValueMap)
                {
                   
                    var new_uid=j.split('-');
                    if($scope.eventList[i]==new_uid[0])
                    {
                        var specialist_name=$scope.FinalEnteredVal['U0jQjrOkFjR'];
                        var org=getheirarchy($scope.FinalEnteredVal['orgunitid']);
                                  
                                   var case1=$scope.FinalEnteredVal['hTXa7qrYv3u'];
                                   var case2=$scope.FinalEnteredVal['vhG2gN7KaEK'];
                                  
                                   var case3_value1=$scope.FinalEnteredVal['zXdqhofvW2r'];
                                   if(case3_value1 == undefined )
                                   case3_value1=0;

                                   var case3_value2=$scope.FinalEnteredVal['ZZleevtpH87'];
                                   if( case3_value2 == undefined)
                                   case3_value2=0;

                                    var case3=((case3_value1/case3_value2)*100).toFixed(2);
                                    
                                                      
                                   var case4_value1_num=$scope.FinalEnteredVal['yQELYdrwRXg'];
                                   if( case4_value1_num == undefined)
                                   case4_value1_num=0;
                                   var case4_value2_num=$scope.FinalEnteredVal['jBlJz2IMl1S'];
                                   if( case4_value2_num == undefined)
                                   case4_value2_num=0;
                                   var case4_value3_num=$scope.FinalEnteredVal['DZMhZgqgKJa'];
                                   if( case4_value3_num == undefined)
                                   case4_value3_num=0;
                                   var case4_value1_dem=$scope.FinalEnteredVal['o1CRenXyXWt'];
                                   if( case4_value1_dem == undefined)
                                   case4_value1_dem=0;
                                   var case4_value2_dem=$scope.FinalEnteredVal['dq0j1v6wMhZ'];
                                   if( case4_value2_dem == undefined)
                                   case4_value2_dem=0;
                                   var case4_value3_dem=$scope.FinalEnteredVal['cvwppxdbycu'];
                                   if( case4_value3_dem == undefined)
                                   case4_value3_dem=0;
                                    var case4=(((case4_value1_num+case4_value2_num+case4_value3_num)/(case4_value1_dem+case4_value2_dem+case4_value3_dem))*100).toFixed(2);
                                    
                        var case5=$scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'fmgq14VGiJ8'];
                       var case1_load,case1_val,case1_point,
                                    case2_load,case2_val,case2_point,
                                         case3_Load,case3_val,case3_point,
                                                case4_Load,case4_val,case4_point,
                                                   case5_Load,case5_val,case5_point;
///case 1
                         if(case1==undefined)
                         {
                            case1_load=0;
                            case1_val=0;
                            case1_point=0;
                            
                         }
                         else
                         {
                            if(case1<=300)
                            {
                                case1_load="<300";
                                case1_val=case1;
                                case1_point="2.5";
                            }
                            else if(case1>=301 && case1<=375)
                            {
                                case1_load="301 to 375";
                                case1_val=case1;
                                case1_point="5";
                            }
                            else if(case1>=376 && case1<=450)
                            {
                                case1_load="376 to 450";
                                case1_val=case1;
                                case1_point="7.5";
                            }
                            else if( case1>=450)
                            {
                                case1_load=">450";
                                case1_val=case1;
                                case1_point="10";
                            }
                            else {
                                case1_load="50";
                                case1_val=case1;
                                case1_point="0";
                            }
                            
                         }
                        

///////////case 2
                        if(case2==undefined)
                        {
                            case2_load=0;
                            case2_val=0;
                            case2_point=0;
                        }
                        else
                        {
                        if(case2!=undefined)
                        {
                        if(case2<=2 )
                        {
                            case2_load="<2";
                            case2_val=case2;
                            case2_point="2.5";
                        }
                        else  if(case2>=2 && case2<=5)
                        {
                            case2_load="2 to 5";
                            case2_val=case2;
                            case2_point="5";
                        }
                        else  if(case2>=6 && case2<=10)
                        {
                            case2_load="6 to 10";
                            case2_val=case2;
                            case2_point="7.5";
                        }
                        else if( case2>=10)
                        {
                            case2_load=">10";
                            case2_val=case2;
                            case2_point="10";
                        }
                        else {
                            case2_load="0";
                            case2_val=case2;
                            case2_point="0";
                        }
                    }
                }
                        /////case 3
                        console.log(case3)
                        if(case3==undefined)
                        {
                            case3_Load=0;
                            case3_val=0;
                            case3_point=0;
                        }
                        else
                        {
                            if(case3!=undefined)
                         {
                        if(case3<=25 )
                        {
                            case3_Load="Upto 25%";
                            case3_val=case3;
                            case3_point="2.5";
                        }
                         else if(case3>=26 && case3<=50)
                        {
                            case3_Load="25% to 50%";
                            case3_val=case3;
                            case3_point="5";
                        }
                        else if(case3>=51 && case3<=75)
                        {
                            case3_Load="50% to 75%";
                            case3_val=case3;
                            case3_point="3.75";
                        }
                        else if( case3>=100)
                        {
                            case3_Load=">100%";
                            case3_val=case3;
                            case3_point="5";
                        }
                        else if(case4==="NaN")
                                   {
                                    case3_Load="0";
                                    case3_val="0";
                                    case3_point="0";
                                   }
                        else 
                        {
                            case3_Load="0";
                            case3_val=case3;
                            case3_point="0";
                        }
                    }
                }



                //case 4
                if(case4==undefined)
                        {
                            case4_Load=0;
                            case4_val=0;
                            case4_point=0;
                        }
                        else
                        {
                            if(case4!=undefined)
                         {
                        if(case4<=25)
                        {
                            case4_Load="upto 25% ";
                            case4_val=case4;
                            case4_point="1.25";
                        }
                        else  if(case4>=25 && case4<=50)
                        {
                            case4_Load="25 to 50";
                            case4_val=case4;
                            case4_point="2.5";
                        }
                        else if(case4>=51 && case4<=75)
                        {
                            case4_Load="50% to 75%";
                            case4_val=case4;
                            case4_point="3.75";
                        }
                        else if( case4>=8)
                        {
                            case4_Load=">100%";
                            case4_val=case4;
                            case4_point="5";
                        }
                        else if(case4==="NaN")
                                   {
                                    case4_Load="0";
                                    case4_val="0";
                                    case4_point="0";
                                   }
                        else {
                            case4_Load="0";
                            case4_val=case4;
                            case4_point="0";
                        }
                    }
                }


                //case 5
                if(case5==undefined)
                        {
                            case5_Load=0,case5_val=0,case5_point=0;
                        }
                        else
                        {
                            if(case4!=undefined)
                         {
                            case5_Load="",case5_val=case5,case5_point=0;
                    }
                }
                       
                
                $scope.total=(Number(case1_point)+Number(case2_point)+Number(case3_point)+Number(case4_point)).toFixed(2);
                        if($scope.total=="NaN")
                        $scope.total=0;

                        $scope.dataimport=$(
                            "<tr>"+
                               "<th>"+event_date+"</th>"+
                               "<th>"+org+"</th>"+
                               "<th>"+$scope.specialist_name+"</th>"+
                               "<th>"+case1_load+"</th>"+
                               "<th>"+case1_val+"</th>"+
                               "<th>"+case1_point+"</th>"+

                               "<th>"+case2_load+"</th>"+
                               "<th>"+case2_val+"</th>"+
                               "<th>"+case2_point+"</th>"+

                               "<th>"+case3_Load+"</th>"+
                               "<th>"+case3_val+"</th>"+
                               "<th>"+case3_point+"</th>"+

                               "<th>"+case4_Load+"</th>"+
                               "<th>"+case4_val+"</th>"+
                               "<th>"+case4_point+"</th>"+

                               "<th>"+case5_Load+"</th>"+
                               "<th>"+case5_val+"</th>"+
                               "<th>"+case5_point+"</th>"+
                               
                               "<th>"+$scope.total+"</th>"+
                               
                               
                            "</tr>"
                            
                       )
                    }
                   
                    
                }
                $("#showdata").append($scope.dataimport);
                
                
            
           }
        }
        
        ///Paediatric Anaesthetist Gynaecologist- Remark Report
        var dfd = $.Deferred(),  // Master deferred
        dfdNext = dfd; // Next deferred in the chain
    
            if(programname=="Paediatric Remarks Report" && new_psuid=="PfRIIrvnjcU" ||$scope.programname=="Anaesthetist Remarks Report" ||$scope.programname=="Gynaecologist Remarks Report" )
            {
                for(var i=0;i<$scope.eventList.length;i++)
               {
                var eveid=$scope.eventList[i];
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    contentType: "application/json",
                    async:false,
                    url: "../../events/"+eveid+".json",
                     success: function (data) {
                         var teiid=data.trackedEntityInstance;
            
                         $.ajax({
                            type: "GET",
                            dataType: "json",
                            contentType: "application/json",
                            async:false,
                            url: "../../trackedEntityInstances/"+teiid+".json",
                             success: function (datanew) {
                                
                                for(var jj=0;jj<datanew.attributes.length;jj++)
                                {
            
                                    var val=datanew.attributes[jj].attribute;
                                    if(datanew.attributes[jj].attribute=="U0jQjrOkFjR")
                                    {
                                        $scope.specialist_name=datanew.attributes[jj].value;
                                    }
                                    if(datanew.attributes[jj].attribute=="aXT3MKVuHQR")
                                    {
                                        $scope.contact_number=datanew.attributes[jj].value;
                                    }
                                }
            
            
                                 
                            }
                        });
            
                    }
                });
              
                if($scope.specialist_name==undefined)
                {
                    $scope.specialist_name="";
            
                }
                   var organisation=[];
                    for(var j in $scope.eventDeWiseValueMap)
                    {
                        var new_uid=j.split('-');
                        if($scope.eventList[i]==new_uid[0])
                        {
                           
                           
                            var orgheirarchy=getheirarchy($scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'orgunitid']);


                                $.when(orgheirarchy).then(function (res) {
                                    
                                var event_date=$scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'eventDate'];
                                var Remark=$scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'PTDWef0EKBH'];
                                var Challenges_faced=$scope.eventDeWiseValueMap[$scope.eventList[i]+'-'+'C1Hr5tSOFhO'];
                                

                                if(Remark==undefined)
                                {
                                    Remark=""
                                }
                               if(Challenges_faced==undefined)
                                {
                                    Challenges_faced=""
                                }
                                if(Challenges_faced==undefined)
                                {
                                    contact_number=""
                                }
                                
                                    finalvalue(event_date, orgheirarchy, $scope.specialist_name, Remark, Challenges_faced,$scope.contact_number);
                            
                               
                                 

                            });

                    }}$("#showdata").append($scope.dataimport);} }
                    Loader.hideLoader()
                }
                    
                    

   
    finalvalue=function(event_date, orgheirarchy,specialist_name, Remark,Challenges_faced,contact_number)
    {
        $scope.dataimport=$(
            "<tr>"+
               "<th>"+event_date+"</th>"+
               "<th>"+orgheirarchy+"</th>"+
               "<th>"+specialist_name+"</th>"+
               "<th>"+contact_number+"</th>"+
               "<th>"+Challenges_faced+"</th>"+
               "<th>"+Remark+"</th>"+
               
            "</tr>"
            
       )

      
       
    }
    getheirarchy=function(org){


        $scope.hierarchy="";
        $scope.orgid=org;
        var myMap=[];
            var parent=""
            MetadataService.getheirarchyname($scope.orgid).then(function (data) {
               
               if(data.level==2)
               {
                myMap.push(data.name);
                myMap.push(data.parent.name)
               }
               if(data.level==3)
               {
                myMap.push(data.name);
                myMap.push(data.parent.name)
                myMap.push(data.parent.parent.name)
               }
               if(data.level==4)
               {
                myMap.push(data.name);
                myMap.push(data.parent.name)
                myMap.push(data.parent.parent.name)
                myMap.push(data.parent.parent.parent.name)
               }
               if(data.level==5)
               {
                myMap.push(data.name);
                myMap.push(data.parent.name)
                myMap.push(data.parent.parent.name)
                myMap.push(data.parent.parent.parent.name)
                myMap.push(data.parent.parent.parent.parent.name)
               }
               if(data.level==6)
               {
                myMap.push(data.name);
                myMap.push(data.parent.name)
                myMap.push(data.parent.parent.name)
                myMap.push(data.parent.parent.parent.name)
                myMap.push(data.parent.parent.parent.parent.name)
                myMap.push(data.parent.parent.parent.parent.parent.name)
               }
                
                         // $scope.programs.push({name:"",id:""});
            });
            
            
           for(var i=myMap.length-1;i>=0;i--)
           {
            $scope.hierarchy+=myMap[i]+"/";
           }
        
        return $scope.hierarchy;
        
    }

    getFinalvalue=function(eventDeWiseValueMap,neweventval,programname)
    {
        $scope.value_entered=[];
        $scope.Final_value_entered=[];
        var val1=0,val2=0,val3=0,val4=0,val5=0,val6=0,val7=0,val8=0,val9=0,val10=0,specialistname,orgunit,orgunitid;
        for(var y=0;y<neweventval.length;y++)
        {
            for(var x in eventDeWiseValueMap)
            {
               
                if(x.includes(neweventval[y]))
                {
                    
                    $scope.value_entered[x]=eventDeWiseValueMap[x];
                    $scope.eventDeWiseValueMap.splice(x,1);
                }
            }
        }
       
        if(programname=="Anaesthetist- PBR monitoring(Aggregated)")
        {

        
        for(var i in $scope.value_entered)
        {
           
            specialistname=$scope.value_entered[i];
            
            if(i.includes("qbgFsR4VWxU"))
            {
                val1+=Number($scope.value_entered[i]);
            
            }
            if(i.includes("vhG2gN7KaEK"))
            {
                val2+=Number($scope.value_entered[i]);
            
            }
            if(i.includes("zfMOVN2lc1S"))
            {
                val3+=Number($scope.value_entered[i]);
            
            }
            if(i.includes("orgUnit"))
            {
                orgunit=$scope.value_entered[i];
            
            }
            if(i.includes("orgunitid"))
            {
                orgunitid=$scope.value_entered[i];
            
            }
           
            
        }
    
        $scope.Final_value_entered["U0jQjrOkFjR"]=specialistname;
        $scope.Final_value_entered["qbgFsR4VWxU"]=val1;
        $scope.Final_value_entered["vhG2gN7KaEK"]=val2;
        $scope.Final_value_entered["zfMOVN2lc1S"]=val3;
        $scope.Final_value_entered["orgunit"]=orgunit;
        $scope.Final_value_entered["orgunitid"]=orgunitid
    }


   
    if(programname=="Gynaecologist- PBR monitoring(Aggregated)")
        {

        
        for(var i in $scope.value_entered)
        {
            if(i.includes("orgunitid"))
            {
                orgunitid=$scope.value_entered[i];
            
            }
            if(i.includes("U0jQjrOkFjR"))
            {
                specialistname=$scope.value_entered[i];
            
            }
            
            if(i.includes("kChiZJPd5je"))
            {
                val1+=Number($scope.value_entered[i]);
            
            }
            if(i.includes("wTdcUXWeqhN"))
            {
                val2+=Number($scope.value_entered[i]);
            
            }
            if(i.includes("eryy31EUorR"))
            {
                val3+=Number($scope.value_entered[i]);
            
            }
            if(i.includes("cqw0HGZQzhD"))
            {
                val4+=Number($scope.value_entered[i]);
            
            }
            if(i.includes("orgUnit"))
            {
                orgunit=$scope.value_entered[i];
            
            }
           
            
        }
    
        $scope.Final_value_entered["U0jQjrOkFjR"]=specialistname;
        $scope.Final_value_entered["kChiZJPd5je"]=val1;
        $scope.Final_value_entered["wTdcUXWeqhN"]=val2;
        $scope.Final_value_entered["eryy31EUorR"]=val3;
        $scope.Final_value_entered["cqw0HGZQzhD"]=val4;
        $scope.Final_value_entered["orgunit"]=orgunit;
        $scope.Final_value_entered["orgunitid"]=orgunitid
    }


   
        if(programname=="Paediatric- PBR monitoring(Aggregated)")
        {
            for(var i in $scope.value_entered)
            {
            
            if(i.includes("U0jQjrOkFjR"))
            {
                specialistname=$scope.value_entered[i];
            
            }
            if(i.includes("hTXa7qrYv3u"))
            {
                val1+=Number($scope.value_entered[i]);
            
            }
            if(i.includes("wmoYsnIYwXp"))
            {
                val2+=Number($scope.value_entered[i]);
            
            }
            if(i.includes("zXdqhofvW2r"))
            {
                val3+=Number($scope.value_entered[i]);
            
            }
            if(i.includes("ZZleevtpH87"))
            {
                val4+=Number($scope.value_entered[i]);
            
            }
            if(i.includes("yQELYdrwRXg"))
            {
                val5+=Number($scope.value_entered[i]);
            
            }
            if(i.includes("jBlJz2IMl1S"))
            {
                val6+=Number($scope.value_entered[i]);
            
            }
            if(i.includes("DZMhZgqgKJa"))
            {
                val7+=Number($scope.value_entered[i]);
            
            }
            if(i.includes("o1CRenXyXWt"))
            {
                val8+=Number($scope.value_entered[i]);
            
            }
            if(i.includes("dq0j1v6wMhZ"))
            {
                val9+=Number($scope.value_entered[i]);
            
            }
            if(i.includes("cvwppxdbycu"))
            {
                val10+=Number($scope.value_entered[i]);
            
            }
            if(i.includes("orgUnit"))
            {
                orgunit=$scope.value_entered[i];
            
            }
            if(i.includes("orgunitid"))
            {
                orgunitid=$scope.value_entered[i];
            
            }

        }
            $scope.Final_value_entered["U0jQjrOkFjR"]=specialistname;
            $scope.Final_value_entered["hTXa7qrYv3u"]=val1;
            $scope.Final_value_entered["vhG2gN7KaEK"]=val2;
            $scope.Final_value_entered["zXdqhofvW2r"]=val3;
            $scope.Final_value_entered["ZZleevtpH87"]=val4;
            $scope.Final_value_entered["yQELYdrwRXg"]=val5;
            $scope.Final_value_entered["jBlJz2IMl1S"]=val6;
            $scope.Final_value_entered["DZMhZgqgKJa"]=val7;
            $scope.Final_value_entered["o1CRenXyXWt"]=val8;
            $scope.Final_value_entered["dq0j1v6wMhZ"]=val9;
            $scope.Final_value_entered["cvwppxdbycu"]=val10;
            $scope.Final_value_entered["orgunit"]=orgunit;
            $scope.Final_value_entered["orgunitid"]=orgunitid

        }


    



       return $scope.Final_value_entered;

    }
        $scope.final_orghirarcy = [];

        function getorghirarcy(org_path) {

               $scope.orghirarcy = [];
               var org_str = [];
               var  org_val="";
               for (var key in org_path ) {

                   var path=org_path[key];
                   var str=path.split("/");
                   $scope.orghirarcy[key] = str;

               }
            $scope.neworghirarcy_path= [];
            $scope.neworghirarcy= [];

            for(var x in $scope.orghirarcy)
            {
                for (var y=0;y<$scope.orghirarcy[x].length ;y++) {

                    if($scope.orghirarcy[x][y]!=0)
                    {
                        var new_key=$scope.orghirarcy[x][y];
                        $.ajax({
                            type: "GET",
                            dataType: "json",
                            contentType: "application/json",
                            async:false,
                            url: "../../organisationUnits/"+new_key+".json?fields=id,name&paging=false",
                            success: function (data) {
                                $scope.neworghirarcy_path.push(data.name);
                            }
                        });
                    }




                }
                $scope.neworghirarcy[x]=$scope.neworghirarcy_path;
                $scope.neworghirarcy_path= [];

            }
           for (var kk in $scope.neworghirarcy) {

               for (var yy=0;yy<$scope.neworghirarcy[kk].length ;yy++) {

                   org_v = $scope.neworghirarcy[kk][yy] + "/";
                   org_str += org_v;
            }
               $scope.final_orghirarcy[kk] = org_str;
               org_str=[];
           }
            //console.log(org_str);

            return $scope.final_orghirarcy;

        }




        
    });