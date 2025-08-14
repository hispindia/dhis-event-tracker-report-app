
-- TRACKER_REPORTS_TEI_ATTR_ENROLLED 03/07/2025 ( manually to be add ) default not added
-- type -- query -- respect system setting
select tei.uid tei ,min(tea.name) attrname,tea.uid attruid,min(teav.value) attrvalue,ou.name,tei.created,pi.enrollmentdate enrolldate 
from programinstance pi 
INNER JOIN trackedentityinstance tei ON  pi.trackedentityinstanceid = tei.trackedentityinstanceid 
INNER JOIN trackedentityattributevalue teav ON  teav.trackedentityinstanceid = pi.trackedentityinstanceid 
INNER JOIN trackedentityattribute  tea ON teav.trackedentityattributeid = tea.trackedentityattributeid 
INNER JOIN organisationunit ou ON ou.organisationunitid = pi.organisationunitid 
WHERE pi.programid IN
(select programid from program where uid = '${program}')
and pi.organisationunitid IN (select organisationunitid from organisationunit where path like '%${orgunit}%') 
and pi.enrollmentdate >='${startdate}' and pi.enrollmentdate<= '${enddate}' group by
 tei.uid,pi.enrollmentdate,tea.uid,ou.name,tei.created order by pi.enrollmentdate,tei.uid;


select tei.uid tei ,min(tea.name) attrname,tea.uid attruid,min(teav.value) attrvalue,ou.name,tei.created,pi.enrollmentdate enrolldate 
from programinstance pi 
INNER JOIN trackedentityinstance tei ON  pi.trackedentityinstanceid = tei.trackedentityinstanceid 
INNER JOIN trackedentityattributevalue teav ON  teav.trackedentityinstanceid = pi.trackedentityinstanceid 
INNER JOIN trackedentityattribute  tea ON teav.trackedentityattributeid = tea.trackedentityattributeid 
INNER JOIN organisationunit ou ON ou.organisationunitid = pi.organisationunitid 
WHERE pi.programid IN
(select programid from program where uid = '${program}')
and pi.organisationunitid IN (select organisationunitid from organisationunit where path like '%${orgunit}%') 
and pi.enrollmentdate >='${startdate}' and pi.enrollmentdate<= '${enddate}' group by
 tei.uid,pi.enrollmentdate,tea.uid,ou.name,tei.created order by pi.enrollmentdate,tei.uid


-- TRACKER_REPORT_TEI_ENROLLED_ATTR_VALUE
select tei.uid tei ,min(tea.name) attrname,tea.uid attruid,min(teav.value) attrvalue,ou.name,tei.created,pi.enrollmentdate enrolldate 
from programinstance pi 
INNER JOIN trackedentityinstance tei ON  pi.trackedentityinstanceid = tei.trackedentityinstanceid 
INNER JOIN trackedentityattributevalue teav ON  teav.trackedentityinstanceid = pi.trackedentityinstanceid 
INNER JOIN trackedentityattribute  tea ON teav.trackedentityattributeid = tea.trackedentityattributeid 
INNER JOIN organisationunit ou ON ou.organisationunitid = pi.organisationunitid 
WHERE pi.programid IN (select programid from program where uid = '${program}') and 
pi.organisationunitid IN (select organisationunitid from organisationunit where path like '%${orgunit}%') 
and pi.enrollmentdate::DATE >='${startdate}' and pi.enrollmentdate::DATE <= '${enddate}' 
group by tei.uid,pi.enrollmentdate,tea.uid,ou.name,tei.created order by pi.enrollmentdate;

-- TRACKER_REPORT_TEI_ENROLLED_ATTR_VALUE
select tei.uid tei ,min(tea.name) attrname,tea.uid attruid,min(teav.value) attrvalue,ou.name,tei.created,pi.enrollmentdate enrolldate
from programinstance pi
INNER JOIN trackedentityinstance tei ON  pi.trackedentityinstanceid = tei.trackedentityinstanceid
INNER JOIN trackedentityattributevalue teav ON  teav.trackedentityinstanceid = pi.trackedentityinstanceid
INNER JOIN trackedentityattribute  tea ON teav.trackedentityattributeid = tea.trackedentityattributeid
INNER JOIN organisationunit ou ON ou.organisationunitid = pi.organisationunitid
WHERE pi.programid IN
(select programid from program where uid = '${program}')
and pi.organisationunitid IN (select organisationunitid from organisationunit where path like '%${orgunit}%')
and pi.enrollmentdate::DATE >='${startdate}' and pi.enrollmentdate::DATE <= '${enddate}' group by
tei.uid,pi.enrollmentdate,tea.uid,ou.name,tei.created order by pi.enrollmentdate;

--- before 2.32 SQLQUERY_TEI_DATA_VALUE_V1
select tei.uid tei,ps.uid psuid,min(ps.name) psname,psi.uid ev ,psi.executiondate evdate,de.uid deuid,min(de.name) dename,min(tedv.value) devalue,ou.name, 
pi.enrollmentdate enrollDate from programstageinstance psi 
INNER JOIN programinstance pi ON  psi.programinstanceid = pi.programinstanceid 
INNER JOIN trackedentityinstance tei ON  pi.trackedentityinstanceid = tei.trackedentityinstanceid 
INNER JOIN trackedentitydatavalue tedv ON tedv.programstageinstanceid = psi.programstageinstanceid 
INNER JOIN dataelement de ON de.dataelementid = tedv.dataelementid 
INNER JOIN programstage ps ON ps.programstageid = psi.programstageid 
INNER JOIN organisationunit ou ON ou.organisationunitid = psi.organisationunitid 
WHERE psi.programstageid IN (select programstageid from programstage where programid IN (select programid from program where uid = '${program}')) 
and psi.organisationunitid IN (select organisationunitid from organisationunit where path like '%${orgunit}%') and pi.enrollmentdate between '${startdate}' 
and '${enddate}' group by tei.uid,ps.uid,psi.uid,psi.executiondate,de.uid,ou.name, pi.enrollmentdate order by pi.enrollmentdate,tei.uid,psi.executiondate



-- 2.32 --- SQLQUERY_TEI_DATA_VALUE_V1
select tei.uid tei,ps.uid psuid,min(ps.name) psname,psi.uid ev ,psi.executiondate evdate,ou.name,
pi.enrollmentdate enrollDate, psi.eventdatavalues from programstageinstance psi
INNER JOIN programinstance pi ON psi.programinstanceid = pi.programinstanceid
INNER JOIN trackedentityinstance tei ON pi.trackedentityinstanceid = tei.trackedentityinstanceid
INNER JOIN programstage ps ON ps.programstageid = psi.programstageid
INNER JOIN organisationunit ou ON ou.organisationunitid = psi.organisationunitid
WHERE psi.programstageid IN(select programstageid from programstage where programid IN(select programid from program where uid = '${program}'))
and psi.organisationunitid IN(select organisationunitid from organisationunit where path like '%${orgunit}%') and pi.enrollmentdate between '${startdate}'
and '${enddate}'group by tei.uid, ps.uid, psi.uid, psi.executiondate, ou.name, psi.eventdatavalues, pi.enrollmentdate order by pi.enrollmentdate, 
tei.uid, psi.executiondate;


-- before 2.32 SQLQUERY_EVENT_V1
select ps.uid psuid,min(ps.name) psname,psi.uid ev ,psi.executiondate evdate,de.uid deuid,min(de.name) dename,min(tedv.value) devalue,ou.name, 
psi.executiondate::DATE from programstageinstance psi 
INNER JOIN programinstance pi ON  psi.programinstanceid = pi.programinstanceid 
INNER JOIN trackedentitydatavalue tedv ON tedv.programstageinstanceid = psi.programstageinstanceid 
INNER JOIN dataelement de ON de.dataelementid = tedv.dataelementid 
INNER JOIN programstage ps ON ps.programstageid = psi.programstageid 
INNER JOIN organisationunit ou ON ou.organisationunitid = psi.organisationunitid 
WHERE psi.programstageid IN 
(select programstageid from programstage where programid IN (select programid from program where uid = '${program}')) 
and psi.organisationunitid IN (select organisationunitid from organisationunit where path like '%${orgunit}%') 
and psi.executiondate between '${startdate}' and '${enddate}' 
group by ps.uid,psi.uid,psi.executiondate,de.uid,ou.name, psi.executiondate order by psi.executiondate;


-- 2.32 SQLQUERY_EVENT_V1
select ps.uid psuid,min(ps.name) psname,psi.uid ev ,psi.executiondate evdate,ou.name, 
psi.executiondate::DATE, psi.eventdatavalues from programstageinstance psi
 INNER JOIN programinstance pi ON  psi.programinstanceid = pi.programinstanceid
 INNER JOIN programstage ps ON ps.programstageid = psi.programstageid
 INNER JOIN organisationunit ou ON ou.organisationunitid = psi.organisationunitid
 WHERE psi.programstageid IN (select programstageid from programstage
 where programid IN (select programid
 from program
 where uid = '${program}'))
 and psi.organisationunitid IN (select organisationunitid
 from organisationunit
 where path like '%${orgunit}%')
 and psi.executiondate between '${startdate}' and '${enddate}'
 group by ps.uid,psi.uid,psi.executiondate,de.uid,ou.name, psi.executiondate
 order by psi.executiondate;

-- TRACKER_REPORT_OPTION_VALUE -- ( manually to be add )
-- type -- view -- respect system setting
SELECT optvalue.name,optvalue.code, tea.uid from optionvalue optvalue
INNER JOIN trackedentityattribute tea ON tea.optionsetid  = optvalue.optionsetid
INNER JOIN optionset opt ON opt.optionsetid = optvalue.optionsetid
INNER JOIN dataelement de ON de.optionsetid = optvalue.optionsetid;

-- OptionValue -- ( manually to be add )
-- type -- view -- respect system setting
SELECT optvalue.name,optvalue.code, tea.uid from optionvalue optvalue
INNER JOIN trackedentityattribute tea ON tea.optionsetid  = optvalue.optionsetid
INNER JOIN optionset opt ON opt.optionsetid = optvalue.optionsetid;


-- TRACKER_REPORT_TEI_ENROLLED_ATTR_VALUE as on 23/05/2025 ( manually to be add )

-- type -- query -- respect system setting
select tei.uid tei ,min(tea.name) attrname,tea.uid attruid,min(teav.value) attrvalue,ou.name,tei.created,pi.enrollmentdate enrolldate from programinstance pi INNER JOIN trackedentityinstance tei ON  pi.trackedentityinstanceid = tei.trackedentityinstanceid INNER JOIN trackedentityattributevalue teav ON  teav.trackedentityinstanceid = pi.trackedentityinstanceid INNER JOIN trackedentityattribute  tea ON teav.trackedentityattributeid = tea.trackedentityattributeid INNER JOIN organisationunit ou ON ou.organisationunitid = pi.organisationunitid WHERE pi.programid IN (select programid from program where uid = '${program}') and pi.organisationunitid IN (select organisationunitid from organisationunit where path like '%${orgunit}%') and pi.enrollmentdate::DATE >='${startdate}' and pi.enrollmentdate::DATE <= '${enddate}' group by tei.uid,pi.enrollmentdate,tea.uid,ou.name,tei.created order by pi.enrollmentdate;


-- SQLQUERY_TEI_DATA_VALUE_V1 as on 03/07/2025 ( manually to be update )

-- type -- query -- respect system setting
select tei.uid tei,ps.uid psuid,min(ps.name) psname,psi.uid ev ,psi.executiondate evdate,ou.name, pi.enrollmentdate enrollDate, psi.eventdatavalues from programstageinstance psi INNER JOIN programinstance pi ON psi.programinstanceid = pi.programinstanceid INNER JOIN trackedentityinstance tei ON pi.trackedentityinstanceid = tei.trackedentityinstanceid INNER JOIN programstage ps ON ps.programstageid = psi.programstageid INNER JOIN organisationunit ou ON ou.organisationunitid = psi.organisationunitid WHERE psi.programstageid IN(select programstageid from programstage where programid IN(select programid from program where uid = '${program}')) and psi.organisationunitid IN(select organisationunitid from organisationunit where path like '%${orgunit}%') and pi.enrollmentdate between '${startdate}' and '${enddate}'group by tei.uid, ps.uid, psi.uid, psi.executiondate, ou.name, psi.eventdatavalues, pi.enrollmentdate order by pi.enrollmentdate,  tei.uid, psi.executiondate;