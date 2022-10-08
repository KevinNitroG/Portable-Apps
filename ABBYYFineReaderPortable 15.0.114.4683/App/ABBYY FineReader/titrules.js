function getDocumentName()
{
	var jobName = event.rawDocumentName;
	var docName = "";
	var pafn = event.appName.toUpperCase();
	switch (pafn)
	{
	case "NOTEPAD.EXE":		// Windows notepad
		docName = like_NOTEPAD(jobName);
		break;
	case "WINWORD.EXE":		// MS Word
	case "POWERPNT.EXE":
		docName = like_WINWORD(jobName);
		break;
	case "IEXPLORE.EXE":	// MS Internet Explorer
		docName = like_IEXPLORE(jobName);
		break;
	case "VISIO.EXE":
		docName = like_VISIO(jobName);
		break;
	case "WINHLP32.EXE":
		docName = like_WINHLP32(jobName);
		break;
	case "HH.EXE":
		docName = like_HH(jobName);
		break;
	case "ACAD.EXE":
	case "ACADLT.EXE":
		docName = like_ACad(jobName);
		break;
	case "123W.EXE":
		docName = like_WINWORD(jobName);
		break;
	default:				// Any other application
		if (jobName == "")
			jobName = event.appName;
		docName = like_DefaultApp(jobName);
	}
	return eliminateBadChars(docName);
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//		Helper functions
	
function cutOffPath(s)
{
	return s.substr(s.lastIndexOf("\\") + 1);
}

function cutOffExtension(s)
{
	var extix = s.lastIndexOf(".");
	if (extix < 0) extix = s.length;
	return s.slice(0, extix);
}


function eliminateBadChars(s)
{
//	var r = /[\/\\<>:"\|\?\*]/g;
//	return s.replace(r, "_");
	return s;
}

function eliminateIERelatedBadChars(s)
{
	var r = /%20/g;
	return s.replace(r, " ");
}

function NumberToFixedLenString(n, l)
{

	var ns = n.toString(10);
	var padlen = ns.length;
	padLen = l - padlen;

	while (padLen > 0)
	{
		ns = "0" + ns;
		padLen--;
	}
	return ns;
}

function like_NOTEPAD(s)
{
	var ix = s.indexOf(" - ");
	if (ix < 0) ix = s.length;
	s = s.slice(0, ix);
	return cutOffExtension(s);
}

function like_WINWORD(s)
{
	var ix = s.indexOf(" - ");
	ix = ix < 0 ? 0 : ix + 3;
	s = s.substr(ix);
	return cutOffExtension(s);
}

function like_IEXPLORE(s)
{
	s = eliminateIERelatedBadChars(s);
	var orgIx = s.indexOf("://");
	
	if (orgIx < 0)
		orgIx = 0;
	else
		orgIx += 3;
	
	var endIx = s.indexOf('/', orgIx);
	if (endIx < 0) endIx = s.length;
	
	return s.substring(orgIx, endIx);
}

function like_VISIO(s)
{
	var orgIx = s.indexOf("-");
	
	if (orgIx < 0)
		orgIx = 0;
	else
		++orgIx;
	
	s = s.substr(orgIx);
	return cutOffExtension(s);
	
}

function like_WINHLP32(s)
{
	var re = /Printing\s+"(.+)"/;
	if (re.exec(s))
	{
		return RegExp.$1;
	}	
	return s;
}

//"mk:@MSITStore:C:\WINDOWS\SYSTEM\UDCHLP.CHM::/resources/word/word.htm"
function like_HH(s)
{
	s = eliminateIERelatedBadChars(s);
	s = cutOffPath(s);
	var i = s.indexOf("::");
	if (i < 0) i = s.length;
	return cutOffExtension(s.slice(0, i));
}

// <path>\<drawing name>space<layout name>space(<index>)
// path, drawing name and layout name can contains spaces, so we cannot detect where is drawing name and where is layout name
function like_ACad(s)
{
	var orgIx = s.lastIndexOf(" (");
	if (orgIx > 0)
		return s.slice(0, orgIx);
	return s;
}

function like_DefaultApp(s)
{
	return cutOffExtension(s);
}
