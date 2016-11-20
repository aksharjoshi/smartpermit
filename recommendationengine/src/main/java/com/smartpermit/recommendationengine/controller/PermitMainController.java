package com.smartpermit.recommendationengine.controller;

import com.smartpermit.recommendationengine.model.*;
import com.smartpermit.recommendationengine.recommender.Recommender;
import com.smartpermit.recommendationengine.repositories.*;
import com.smartpermit.recommendationengine.utils.DateFormatter;
import com.socrata.api.Soda2Consumer;
import com.socrata.builders.SoqlQueryBuilder;
import com.socrata.exceptions.SodaError;
import com.socrata.model.soql.OrderByClause;
import com.socrata.model.soql.SoqlQuery;
import com.socrata.model.soql.SortOrder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;

/**
 * Created by adwaitkaley on 11/10/16.
 */
@Controller
public class PermitMainController {
    @Autowired
    OwnerRepository ownerRepository;
    @Autowired
    PermitDetailsRepository permitDetailsRepository;
    @Autowired
    PermiteeRepository permiteeRepository;
    @Autowired
    PermitRepository permitRepository;
    @Autowired
    OwnerPreferencesRepository ownerPreferencesRepository;
    @Autowired
    Recommender recommenderImpl;

    @RequestMapping(value = "/recommend", method = RequestMethod.GET)
    public ResponseEntity recommendData(@RequestParam("permitId") String permitId, @RequestParam("count") int count) {
        return new ResponseEntity(recommenderImpl.getRecommendations(permitId, count), HttpStatus.OK);
    }

    @RequestMapping(value = "/data", method = RequestMethod.GET)
    public ResponseEntity restData(@RequestParam("offset") int offset, @RequestParam("limit") int limit, @RequestParam("size") int size){
        populateData(offset,limit,size);

        HashMap<String,String> hashMap = new HashMap<>();
        hashMap.put("limit",limit+" records inserted successfully ");

        return new ResponseEntity(hashMap, HttpStatus.OK);

    }

    @RequestMapping(value = "/build", method = RequestMethod.GET)
    public ResponseEntity buildDataModel() {
        HashMap<String, List<String>> ownerPermitMap = permitDetailsRepository.findAllOwnersAndPermits();
        for (String ownerId : ownerPermitMap.keySet()) {
            List<String> permitIdsList = ownerPermitMap.get(ownerId);
            for (String permitId : permitIdsList) {
                long longOwner = Long.valueOf(ownerId);
                long longPermit = Long.valueOf(permitId);
                if (ownerPreferencesRepository.findOwnerPreferenceById(longOwner, longPermit) == null) {
                    ownerPreferencesRepository.create(new OwnerPreferences(longOwner, longPermit, 1));
                } else {
                    ownerPreferencesRepository.incrementPreferencecount(longOwner, longPermit);
                }
            }
        }

        return new ResponseEntity("Data Model Populated", HttpStatus.OK);
    }
    public void populateData(int offset, int limit,int iterationCount){
        /*
        *
        * Populate Data in Chunks of 1000 rows from Socrata API
        *
        * */

        int i = offset;

        while (i < limit){

           List<InputData> inputDataList = getDataUsingSocrata(i,iterationCount);

            if(inputDataList != null) {
                try {
                    Thread.sleep(5000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
                System.out.println("Done Processing : " + (i + iterationCount) + "records");

                processOwners(inputDataList);
                processPermitees(inputDataList);
                processPermits(inputDataList);

                System.out.println("Done Inserting : " + (i + iterationCount) + "records in the database");
            } else {
                System.out.println("Issue with inserting records from : "+ i);
                break;
            }

            i = i + iterationCount;
        }
    }

    private List<InputData> getDataUsingSocrata(int offset, int limit){

        ArrayList<String> selectColumns = new ArrayList<String>(Arrays.asList(
                " bin__", "permit_sequence__", "permit_status", "filing_status", "filing_date", "issuance_date", "expiration_date", "permit_type", "permit_subtype", "work_type", "job_type", "job_start_date", "permittee_s_first_name", "permittee_s_last_name", "permittee_s_business_name", "permittee_s_license_type", "permittee_s_license__", "borough", "owner_s_first_name", "owner_s_last_name", "owner_s_phone__", "owner_s_house__", "owner_s_house_street_name", "city", "state", "owner_s_zip_code", "house__", "street_name", "zip_code"
        ));

        Soda2Consumer consumer =  Soda2Consumer.newConsumer("https://data.cityofnewyork.us");
        SoqlQuery soqlQuery = new SoqlQueryBuilder()
                .addSelectPhrases(selectColumns)
                .setWhereClause("residential = 'YES'")
                .addOrderByPhrase(new OrderByClause(SortOrder.Ascending,"bin__"))
                .setOffset(offset)
                .setLimit(limit)
                .build();
        System.out.println(soqlQuery.toString());
        try {
            //To get a raw String of the results
            List<InputData> inputDataList = consumer.query("ipu4-2q9a", soqlQuery, InputData.LIST_TYPE);
            return inputDataList;

        } catch (SodaError sodaError) {
            sodaError.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        return null;
    }

    private void processOwners (List<InputData> inputDataList){
        List<OwnerDetails> ownerList = new ArrayList<OwnerDetails>();
        HashSet<String> phoneNoList =  new HashSet<String>();
        //OwnerDetailsDAO ownerDetailsDAO = new OwnerDetailsDAO();


        for(String s : ownerRepository.findAllOwnersPhoneNumbers()/*ownerDetailsDAO.getAllOwnerContactDetails()*/){
            phoneNoList.add(s);
        }

        for(InputData inputData : inputDataList){
            String phoneNum = inputData.getOwnerPhoneNumber();
            if(phoneNum.length() == 10 && !phoneNoList.contains(phoneNum)){
                OwnerDetails ownerDetails =  new OwnerDetails(
                        inputData.getOwnerFirstName(),
                        inputData.getOwnerLastName(),
                        phoneNum,
                        inputData.getOwnerHouseNumber(),
                        inputData.getOwnerHouseStreetName(),
                        inputData.getOwnerHouseCity(),
                        inputData.getOwnerHouseState(),
                        Integer.parseInt(inputData.getOwnerHouseZip())
                );

                phoneNoList.add(phoneNum);
                ownerList.add(ownerDetails);
            }
        }

        if(ownerList.size() != 0){
            for(OwnerDetails ownerDetails : ownerList){
                //ownerDetailsDAO.insertOwnerDetails(ownerDetails);
                ownerRepository.create(ownerDetails);
            }
        }

    }

    private void processPermitees (List<InputData> inputDataList){
        List<PermiteeDetails> permiteeList = new ArrayList<PermiteeDetails>();
        HashSet<String> licenseNumbers =  new HashSet<String>();
        /*PermiteeDetailsDAO permiteeDetailsDAO = new PermiteeDetailsDAO();*/

        for(String s : permiteeRepository.findAllPermiteeLicences()/*permiteeDetailsDAO.getAllPermiteeLicences()*/){
            licenseNumbers.add(s);
        }

        for(InputData inputData : inputDataList){
            int licnum = inputData.getPermiteeLicenseNumber().matches("[0-9]+") ? Integer.parseInt(inputData.getPermiteeLicenseNumber()) : 0;
            String licenseNum = (licnum == 0) ? "N/A": String.valueOf(licnum);
            if(!"N/A".equals(licenseNum) && !licenseNumbers.contains(licenseNum)){
                PermiteeDetails permiteeDetail =  new PermiteeDetails(
                        inputData.getPermiteeFirstName(),
                        inputData.getPermiteeLastName(),
                        inputData.getPermiteeBusinessName(),
                        licenseNum,
                        inputData.getPermiteeLicenseType()
                );
                licenseNumbers.add(licenseNum);
                permiteeList.add(permiteeDetail);
            }
        }

        if(permiteeList.size() != 0){
            for(PermiteeDetails permiteeDetails : permiteeList){
               /* permiteeDetailsDAO.insertPermiteeDetails(permiteeDetails);*/
                permiteeRepository.create(permiteeDetails);
            }
        }
    }

    private void processPermits (List<InputData> inputDataList){
        List<PermitDetails> permitDetailsList = new ArrayList<>();
        HashSet<String> permits =  new HashSet<>();
        HashMap<String,String> ownerMap = new HashMap<>();
        HashMap<Integer,String> permiteeMap = new HashMap<>();
        HashMap<String,String> permitMap = new HashMap<>();
        DateFormatter dateFormatter = new DateFormatter();

        for(OwnerDetails ownerDetails : ownerRepository.findAllOwners()/*ownerDetailsDAO.getAllOwnerDetails()*/){
            ownerMap.put(ownerDetails.getOwnerPhoneNumber(),ownerDetails.getOwnerId());
        }

        for(PermiteeDetails permiteeDetails : permiteeRepository.findAllPermitees()/*permiteeDetailsDAO.getAllPermiteeDetails()*/){
            permiteeMap.put(Integer.parseInt(permiteeDetails.getPermiteeLicenseNumber()),permiteeDetails.getPermiteeId());
        }

        for(Permit permit : permitRepository.findAllPermits()){
            permitMap.put(permit.getPermitJobType()+permit.getPermitType()+permit.getPermitSubtype(),permit.getPermitId());
        }

        for(PermitDetails s : permitDetailsRepository.findAllPermits()/*permitDetailsDAO.getAllPermitDetails()*/){
            permits.add(
                    s.getPermitBinNumber()+s.getPermitHouseNumber()+s.getPermitJobType()+s.getPermitType()+s.getPermitType()+s.getPermitSubType()+s.getPermitWorkType()+s.getPermitSequenceNumber()+dateFormatter.formatDate(s.getPermitFilingDate())
            );
        }


        String binNum,houseNum,jobType,permitType,permitSubtype,permitWorkType,seqNo,filingDate,issuanceDate,ownerPhoneNumber,permiteeId,ownerId,permitId,permitKey;
        int permiteeLicNum;
        for(InputData inputData : inputDataList) {
            binNum = inputData.getPermitBinNumber();
            houseNum = inputData.getPermitHouseNumber();
            jobType = inputData.getPermitJobType();
            permitType = inputData.getPermitType();
            permitSubtype = inputData.getPermitSubType();
            permitWorkType = inputData.getPermitWorkType();
            seqNo = inputData.getPermitSequenceNumber();
            filingDate = dateFormatter.formatDate(inputData.getPermitFilingDate());
            String record = binNum + houseNum + jobType + permitType + permitSubtype + permitWorkType + seqNo + filingDate;

            String IssuanceDateArr[] = (inputData.getPermitIssuanceDate().substring(0, inputData.getPermitIssuanceDate().indexOf('T'))).split("-");
            issuanceDate = IssuanceDateArr[2] + "/" + IssuanceDateArr[1] + "/" + IssuanceDateArr[0];

            ownerPhoneNumber = inputData.getOwnerPhoneNumber();
            permiteeLicNum = inputData.getPermiteeLicenseNumber().matches("[0-9]+") ? Integer.parseInt(inputData.getPermiteeLicenseNumber()) : 0;

            permiteeId = permiteeMap.containsKey(permiteeLicNum) ? permiteeMap.get(permiteeLicNum) : null;
            ownerId = ownerMap.containsKey(ownerPhoneNumber) ? ownerMap.get(ownerPhoneNumber) : null;

            permitKey = inputData.getPermitJobType() + inputData.getPermitType() + inputData.getPermitSubType();

            permitId = permitMap.containsKey(permitKey) ? permitMap.get(permitKey) : String.valueOf(0);

            if (!"N/A".equals(binNum) && !"N/A".equals(houseNum) && !permits.contains(record) && (ownerId != null) && (permiteeId != null)) {
                PermitDetails permitDetail = new PermitDetails(
                        binNum,
                        inputData.getPermitStatus(),
                        seqNo,
                        inputData.getPermitFilingStatus(),
                        filingDate,
                        dateFormatter.formatDate(issuanceDate),
                        dateFormatter.formatDate(inputData.getPermitExpirationDate()),
                        permitType,
                        permitSubtype,
                        permitWorkType,
                        jobType,
                        dateFormatter.formatDate(inputData.getPermitJobStartDate()),
                        houseNum,
                        inputData.getPermitHouseStreetName(),
                        inputData.getPermitBorough(),
                        inputData.getPermitHouseZip(),
                        permiteeId,
                        ownerId,
                        permitId
                );
                permits.add(record);
                permitDetailsList.add(permitDetail);
            }
        }

            for(PermitDetails permitDetail : permitDetailsList){
                /*permitDetailsDAO.insertPermitDetails(permitDetail);*/
                permitDetailsRepository.create(permitDetail);
            }
    }

}
