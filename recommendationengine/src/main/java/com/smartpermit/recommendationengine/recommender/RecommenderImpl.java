package com.smartpermit.recommendationengine.recommender;

import com.smartpermit.recommendationengine.model.Permit;
import com.smartpermit.recommendationengine.repositories.PermitDetailsRepository;
import com.smartpermit.recommendationengine.repositories.PermitRepository;
import org.apache.mahout.cf.taste.common.TasteException;
import org.apache.mahout.cf.taste.eval.RecommenderBuilder;
import org.apache.mahout.cf.taste.eval.RecommenderEvaluator;
import org.apache.mahout.cf.taste.impl.eval.RMSRecommenderEvaluator;
import org.apache.mahout.cf.taste.impl.model.jdbc.MySQLJDBCDataModel;
import org.apache.mahout.cf.taste.impl.recommender.GenericItemBasedRecommender;
import org.apache.mahout.cf.taste.impl.similarity.EuclideanDistanceSimilarity;
import org.apache.mahout.cf.taste.impl.similarity.LogLikelihoodSimilarity;
import org.apache.mahout.cf.taste.impl.similarity.PearsonCorrelationSimilarity;
import org.apache.mahout.cf.taste.impl.similarity.TanimotoCoefficientSimilarity;
import org.apache.mahout.cf.taste.model.DataModel;
import org.apache.mahout.cf.taste.recommender.RecommendedItem;
import org.apache.mahout.cf.taste.similarity.ItemSimilarity;
import org.apache.tomcat.jdbc.pool.DataSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ResourceLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

/**
 * Created by adwaitkaley on 11/2/16.
 */


@Component
public class RecommenderImpl implements Recommender {

    @Autowired
    PermitRepository permitRepository;

    @Autowired
    PermitDetailsRepository permitDetailsRepository;

    @Autowired
    ResourceLoader resource;

    @Autowired
    JdbcTemplate jdbcTemplate;


    /*

    public List<Permit> KNNBasedRecommendations(String permitId,String ownerId) {

        FastByIDMap<PreferenceArray> preferenceArrayFastByIDMap=new FastByIDMap<PreferenceArray>();
       // List<PermitDetails> permitDetails = permitDetailsRepository.findAllPermits();

        HashMap<String, List<String>> similarOwnersByPermitId = permitDetailsRepository.findAllOwnersAndPermits(permitId,ownerId);
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
        PlusAnonymousConcurrentUserDataModel plusModel = new PlusAnonymousConcurrentUserDataModel(dataModel, 100);
        Long anonymousUserID = plusModel.takeAvailableUser();
        PreferenceArray tempUserpreferences = new BooleanUserPreferenceArray(1);
        tempUserpreferences.setUserID(0,anonymousUserID);
        tempUserpreferences.setItemID(0,Long.valueOf(permitId));

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
            plusModel.releaseUser(anonymousUserID);
        }

        return null;
    }
*/

    @Override
    public List<Permit> getRecommendations(String permitId, int numberOfRecommendations) {
        List<Permit> permitList = new ArrayList<>();
        if (permitId == null || numberOfRecommendations == 0) {
            return permitList;
        }

        List<RecommendedItem> recommendedPermitList = getRecommendedItemList(permitId, numberOfRecommendations);

        if (recommendedPermitList.size() != 0) {
            for (RecommendedItem recommendedItem : recommendedPermitList) {
                Permit permit = permitRepository.findPermitbyId(recommendedItem.getItemID());
                permitList.add(permit);
            }
        }

        return permitList;
    }

    private List<RecommendedItem> getRecommendedItemList(String permitId, int numberOfRecommendations) {
        /*FastByIDMap<PreferenceArray> preferenceArrayFastByIDMap = new FastByIDMap<>();

        HashMap<String, List<String>> similarOwnersByPermitId = permitDetailsRepository.findAllOwnersAndPermits();
        GenericUserPreferenceArray booleanUserPreferenceArray;
        for(String owner : similarOwnersByPermitId.keySet()){
            List<String> permitsForOwner = similarOwnersByPermitId.get(owner);
            booleanUserPreferenceArray = new GenericUserPreferenceArray(permitsForOwner.size());
            Long longOwner = Long.valueOf(owner);
            int preferenceCount = 0;
            for( String permit : permitsForOwner){
                booleanUserPreferenceArray.set(preferenceCount,new BooleanPreference(longOwner,Long.valueOf(permit)));
                preferenceCount++;
            }
            preferenceArrayFastByIDMap.put(longOwner,booleanUserPreferenceArray);
        }
        DataModel datamodel = new GenericDataModel(preferenceArrayFastByIDMap);*/
        MySQLJDBCDataModel dataModel = new MySQLJDBCDataModel(jdbcTemplate.getDataSource(), "OWNER_PREFERENCES", "OWNER_ID", "PERMIT_ID", "PREFERENCE", null);

       /* DataModel datamodel = null;
        File file = new File(this.getClass().getClassLoader().getResource("PERMIT_DETAILS.csv").getFile());

        try {
            datamodel = new FileDataModel(file);
        } catch (IOException e) {
            e.printStackTrace();
        }*/
        ItemSimilarity itemSimilarity = new TanimotoCoefficientSimilarity(dataModel);
        GenericItemBasedRecommender recommender = new GenericItemBasedRecommender(dataModel, itemSimilarity);
        try {
                /*LongPrimitiveIterator iterator = dataModel.getItemIDs();
                ArrayList<Long> itemIds = new ArrayList<>();
                while(iterator.hasNext()){
                    long itemid = iterator.nextLong();*/
            List<RecommendedItem> recommendationList = recommender.mostSimilarItems(Long.valueOf(permitId), numberOfRecommendations);
            for (RecommendedItem recommendedItem : recommendationList) {
                System.out.println(permitId + "," + recommendedItem.getItemID() + "," + recommendedItem.getValue());
            }
            return recommendationList;

                /*}*/


           /* if(recommendationList != null){
                return recommendationList;
            }*/

        } catch (TasteException e) {
            e.printStackTrace();
        }

        return new ArrayList<>();
    }


    private double RMSRecommendationEvaluation(final DataModel dataModel, final ItemSimilarity itemSimilarity) {
        final RecommenderBuilder recommenderBuilder = new RecommenderBuilder() {
            @Override
            public org.apache.mahout.cf.taste.recommender.Recommender buildRecommender(DataModel dataModel) throws TasteException {
                ItemSimilarity similarity = itemSimilarity;
                return new GenericItemBasedRecommender(dataModel, similarity);
            }
        };

        RecommenderEvaluator recommenderEvaluator = new RMSRecommenderEvaluator();
        try {
            return recommenderEvaluator.evaluate(recommenderBuilder, null, dataModel, 0.7, 1);
        } catch (TasteException e) {
            e.printStackTrace();
        }

        return 0.0;
    }

    public HashMap evaluate() {

        MySQLJDBCDataModel dataModel = new MySQLJDBCDataModel(jdbcTemplate.getDataSource(), "OWNER_PREFERENCES", "OWNER_ID", "PERMIT_ID", "PREFERENCE", null);
        List<ItemSimilarity> itemSimilarityList = new ArrayList<>();
        HashMap<Integer,String> integerStringHashMap = new HashMap<Integer,String>(){
            {
                put(0,"PearsonCorrelationSimilarity");
                put(1,"LogLikelihoodSimilarity");
                put(2,"TanimotoCoefficientSimilarity");
                put(3,"EuclideanDistanceSimilarity");
            }
        };
        HashMap<String,Double> itemSimilarityRmseHashMap = new HashMap<>();
        try {
            itemSimilarityList.add(new PearsonCorrelationSimilarity(dataModel));
            itemSimilarityList.add(new LogLikelihoodSimilarity(dataModel));
            itemSimilarityList.add(new TanimotoCoefficientSimilarity(dataModel));
            itemSimilarityList.add(new EuclideanDistanceSimilarity(dataModel));
        } catch (TasteException e) {
            e.printStackTrace();
        }

        for(int i=0;i<itemSimilarityList.size();i++){
            double rootMeanSquareError =  RMSRecommendationEvaluation(dataModel, itemSimilarityList.get(i));
            itemSimilarityRmseHashMap.put(integerStringHashMap.get(i),rootMeanSquareError);

        }
        return itemSimilarityRmseHashMap;
    }

}
