package be.moneyMaker.util;

import be.moneyMaker.util.exception.MyRuntimeException;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by florian on 31/08/14.
 */
public class DateUtil {


	public static Date fromString(String s) {
		Date date = null;
		try {
			date = new SimpleDateFormat("yyyy-MM-dd").parse(s);
		} catch (ParseException e) {
			e.printStackTrace();
			throw new MyRuntimeException(e, e.getMessage());
		}
		return date;
	}

	public static String fromLong(Long l) {
		return new SimpleDateFormat("yyyy-MM-dd hh:mm:ss").format(new Date(l));
	}

/*
	private Date fromString(String s) {
		Date date = null;
		try {
			date = new SimpleDateFormat("yyyy-MM-dd").parse(s);
		} catch (ParseException e) {
			e.printStackTrace();
			throw new MyRuntimeException(e, e.getMessage());
		}
		return date;
	}
	*/
}
