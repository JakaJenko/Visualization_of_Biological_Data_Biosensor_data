function LoadBaseData(variables, timeIntervalStart, timeIntervalEnd)
{
    baseUrl = "http://127.0.0.1:5000/LoadGeneralData?";

    variablesUrl = "variables="+variables;
    timeIntervalStartUrl = "timeIntervalStart="+timeIntervalStart;
    timeIntervalEndUrl = "timeIntervalEnd="+timeIntervalEnd;

    url = baseUrl + variablesUrl + "&" + timeIntervalStartUrl + "&" + timeIntervalEndUrl;
    return HttpGet(url);
}
