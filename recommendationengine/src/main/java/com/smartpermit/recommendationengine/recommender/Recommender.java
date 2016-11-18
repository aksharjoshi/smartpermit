package com.smartpermit.recommendationengine.recommender;

import com.smartpermit.recommendationengine.model.Permit;
import com.smartpermit.recommendationengine.repositories.PermitDetailsRepository;
import com.smartpermit.recommendationengine.repositories.PermitRepository;
import org.apache.mahout.cf.taste.common.TasteException;
import org.apache.mahout.cf.taste.impl.common.FastByIDMap;
import org.apache.mahout.cf.taste.impl.model.*;
import org.apache.mahout.cf.taste.impl.neighborhood.NearestNUserNeighborhood;
import org.apache.mahout.cf.taste.impl.recommender.GenericBooleanPrefUserBasedRecommender;
import org.apache.mahout.cf.taste.impl.similarity.TanimotoCoefficientSimilarity;
import org.apache.mahout.cf.taste.model.DataModel;
import org.apache.mahout.cf.taste.model.PreferenceArray;
import org.apache.mahout.cf.taste.neighborhood.UserNeighborhood;
import org.apache.mahout.cf.taste.recommender.RecommendedItem;
import org.apache.mahout.cf.taste.recommender.UserBasedRecommender;
import org.apache.mahout.cf.taste.similarity.UserSimilarity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;

/**
 * Created by adwaitkaley on 11/2/16.
 */


@Component
public class Recommender {

    @Autowired
    PermitRepository permitRepository;

    @Autowired
    PermitDetailsRepository permitDetailsRepository;

    public List<Permit> KNNBasedRecommendations(String permitId,String ownerId) {

        FastByIDMap<PreferenceArray> preferenceArrayFastByIDMap=new FastByIDMap<PreferenceArray>();
       // List<PermitDetails> permitDetails = permitDetailsRepository.findAllPermits();

        HashMap<String, List<String>> similarOwnersByPermitId = permitDetailsRepository.findSimilarOwnersByPermitId(permitId,ownerId);
        BooleanUserPreferenceArray booleanUserPreferenceArray;
        for(String owner : similarOwnersByPermitId.keySet()){
            List<String> permitsForOwner = similarOwnersByPermitId.get(owner);
            booleanUserPreferenceArray = new BooleanUserPreferenceArray(permitsForOwner.size());
            Long longOwner = Long.valueOf(owner);
            int preferenceCount = 0;
            for( String permit : permitsForOwner){
                booleanUserPreferenceArray.set(preferenceCount,new BooleanPreference(longOwner,Long.valueOf(permit)));
                preferenceCount++;
            }
            preferenceArrayFastByIDMap.put(longOwner,booleanUserPreferenceArray);
        }

        DataModel dataModel= null;

        //dataModel = new FileDataModel(new File("/Users/adwaitkaley/Desktop/295B/dataset.csv"));
        dataModel =new GenericDataModel(preferenceArrayFastByIDMap);

       // For New User Add a Temp entry in Data Model
       /* PlusAnonymousConcurrentUserDataModel plusModel = new PlusAnonymousConcurrentUserDataModel(dataModel, 100);
        Long anonymousUserID = plusModel.takeAvailableUser();
        PreferenceArray tempUserpreferences = new BooleanUserPreferenceArray(1);
        tempUserpreferences.setUserID(0,anonymousUserID);
        tempUserpreferences.setItemID(0,Long.valueOf(permitId));*/

        try {

            UserSimilarity userSimilarity = new TanimotoCoefficientSimilarity(dataModel);

            UserNeighborhood neighborhood = new NearestNUserNeighborhood(2,userSimilarity,dataModel);

            UserBasedRecommender recommender = new GenericBooleanPrefUserBasedRecommender(dataModel, neighborhood, userSimilarity);

            List<RecommendedItem> recommendedList = recommender.recommend(Long.valueOf(ownerId),5);
            for (RecommendedItem recommendedItem : recommendedList){
                System.out.println(recommendedItem.getItemID());
            }
        } catch (TasteException e) {
            e.printStackTrace();
        }
        finally {
            /*plusModel.releaseUser(anonymousUserID);*/
        }

        return null;
    }

/*
    private static void populatePermitDetails(List<PermitDetails> permitList) {
        DBOperations dbOperations = new DBOperations();
        for(PermitDetails permitDetail : permitList){
            dbOperations.insertPermitDetails(permitDetail);
        }
    }

    private static List<PermitDetails> processPermits(List<InputData> inputDataList) {
        List<PermitDetails> permitDetails = new ArrayList<PermitDetails>();
        HashSet<String> permits =  new HashSet<String>();
        HashMap<String,String> ownerMap = new HashMap<String, String>();
        HashMap<Integer,String> permiteeMap = new HashMap<Integer, String>();

        DBOperations dbOperations = new DBOperations();

        for(OwnerDetails ownerDetails : dbOperations.getAllOwnerDetails()){
            ownerMap.put(ownerDetails.getOwnerPhoneNumber(),ownerDetails.getOwnerId());
        }

        for(PermiteeDetails permiteeDetails : dbOperations.getAllPermiteeDetails()){
            permiteeMap.put(Integer.parseInt(permiteeDetails.getPermiteeLicenseNumber()),permiteeDetails.getPermiteeId());
        }

        for(PermitDetails s : dbOperations.getAllPermitDetails()){
            permits.add(
                    s.getPermitBinNumber()+s.getPermitHouseNumber()+s.getPermitJobType()+s.getPermitType()+s.getPermitType()+s.getPermitSubType()+s.getPermitWorkType()+s.getPermitSequenceNumber()+formatDate(s.getPermitFilingDate())
            );
        }


        String binNum,houseNum,jobType,permitType,permitSubtype,permitWorkType,seqNo,filingDate,issuanceDate,ownerPhoneNumber,permiteeId,ownerId;
        int permiteeLicNum;
        for(InputData inputData : inputDataList){
            binNum = inputData.getPermitBinNumber();
            houseNum = inputData.getPermitHouseNumber();
            jobType = inputData.getPermitJobType();
            permitType = inputData.getPermitType();
            permitSubtype = inputData.getPermitSubType();
            permitWorkType = inputData.getPermitWorkType();
            seqNo = inputData.getPermitSequenceNumber();
            filingDate = formatDate(inputData.getPermitFilingDate());
            String record = binNum+houseNum+jobType+permitType+permitSubtype+permitWorkType+seqNo+filingDate;

            String IssuanceDateArr[] = (inputData.getPermitIssuanceDate().substring(0,inputData.getPermitIssuanceDate().indexOf('T'))).split("-");
            issuanceDate = IssuanceDateArr[2]+"/"+IssuanceDateArr[1]+"/"+IssuanceDateArr[0];

            ownerPhoneNumber = inputData.getOwnerPhoneNumber();
            permiteeLicNum = inputData.getPermiteeLicenseNumber().matches("[0-9]+") ? Integer.parseInt(inputData.getPermiteeLicenseNumber()) : 0;

            permiteeId = permiteeMap.containsKey(permiteeLicNum) ? permiteeMap.get(permiteeLicNum) : null;
            ownerId = ownerMap.containsKey(ownerPhoneNumber) ? ownerMap.get(ownerPhoneNumber) : null;
            
            if(!"N/A".equals(binNum) && !"N/A".equals(houseNum) && !permits.contains(record) && (ownerId != null) && (permiteeId != null)){
                    PermitDetails permitDetail =  new PermitDetails(
                            binNum,
                            inputData.getPermitStatus(),
                            seqNo,
                            inputData.getPermitFilingStatus(),
                            filingDate,
                            formatDate(issuanceDate),
                            formatDate(inputData.getPermitExpirationDate()),
                            permitType,
                            permitSubtype,
                            permitWorkType,
                            jobType,
                            formatDate(inputData.getPermitJobStartDate()),
                            houseNum,
                            inputData.getPermitHouseStreetName(),
                            inputData.getPermitBorough(),
                            inputData.getPermitHouseZip(),
                            permiteeId,
                            ownerId
                    );
                    permits.add(record);
                    permitDetails.add(permitDetail);
            }
        }
        return permitDetails;
    }

    private static void populatePermiteeMaster(List<PermiteeDetails> permiteeList) {
        DBOperations dbOperations = new DBOperations();
        for(PermiteeDetails permiteeDetails : permiteeList){
            dbOperations.insertPermiteeDetails(permiteeDetails);
        }
    }

    private static List<PermiteeDetails> processPermitees(List<InputData> inputDataList) {
        List<PermiteeDetails> permiteeList = new ArrayList<PermiteeDetails>();
        HashSet<String> licenseNumbers =  new HashSet<String>();

        for(String s : new DBOperations().getAllPermiteeLicences()){
            licenseNumbers.add(s);
        }

        for(InputData inputData : inputDataList){
            String licenseNum = inputData.getPermiteeLicenseNumber();
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
        return permiteeList;
    }

    private static void populateOwnerMaster(List<OwnerDetails> ownerList) {
        DBOperations dbOperations = new DBOperations();
        List<OwnerDetails> processedOwners = new ArrayList<OwnerDetails>();
        for(OwnerDetails ownerDetails : ownerList){
           dbOperations.insertOwnerDetails(ownerDetails);
        }
    }

    private static List<OwnerDetails> processOwners(List<InputData> inputDataList) {
        List<OwnerDetails> ownerList = new ArrayList<OwnerDetails>();
        HashSet<String> phoneNoList =  new HashSet<String>();

        for(String s : new DBOperations().getAllOwnerContactDetails()){
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
        return ownerList;
    }*/
}
