package com.smartpermit.recommendationengine.utils;

import com.smartpermit.recommendationengine.model.InputData;

import java.io.*;
import java.util.List;

/**
 * Created by adwaitkaley on 11/10/16.
 */
public class CSVWriter {

    public void WriteToCSV(List<InputData> list, String filename){
        final String CSV_SEPARATOR = ",";
        try
        {
            BufferedWriter bw = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(filename+".csv"), "UTF-8"));
            for (InputData record : list)
            {
                StringBuffer oneLine = new StringBuffer();
                oneLine.append(record.getPermitBinNumber());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermitHouseNumber());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermitHouseStreetName());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermitBorough());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermitHouseZip());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermitJobType());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermitType());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermitSubType());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermitWorkType());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermitSequenceNumber());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermitFilingDate());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermitFilingStatus());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermitIssuanceDate());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermitExpirationDate());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermitJobStartDate());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermiteeLicenseNumber());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermiteeFirstName());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermiteeLastName());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermiteeLicenseType());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getPermiteeBusinessName());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getOwnerFirstName());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getOwnerLastName());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getOwnerPhoneNumber());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getOwnerHouseNumber());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getOwnerHouseStreetName());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getOwnerHouseCity());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getOwnerHouseState());
                oneLine.append(CSV_SEPARATOR);
                oneLine.append(record.getOwnerHouseZip());
                oneLine.append(CSV_SEPARATOR);

                bw.write(oneLine.toString());
                bw.newLine();
            }
            bw.flush();
            bw.close();
        }
        catch (UnsupportedEncodingException e) {}
        catch (FileNotFoundException e){}
        catch (IOException e){}
    }

}
