package com.smartpermit.recommendationengine.utils;

import org.springframework.context.annotation.Bean;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * Created by adwaitkaley on 11/10/16.
 */

public class DateFormatter {
    public String formatDate(String stringDate){
        DateFormat sdf = new SimpleDateFormat("MM/dd/yyyy");
        Date date = null;
        try {
            date = sdf.parse(stringDate);
        } catch (ParseException e) {
            e.printStackTrace();
        }
        return  sdf.format(date);
    }

    public String formatHyphenSeperateddate(String stringDate){
        String date[] = stringDate.split("-");
        String formattedDate = date[2]+"/"+date[1]+"/"+date[0];
        return formattedDate;
    }
}
