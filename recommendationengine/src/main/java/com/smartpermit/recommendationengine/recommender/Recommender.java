package com.smartpermit.recommendationengine.recommender;

import com.smartpermit.recommendationengine.model.Permit;

import java.util.HashMap;
import java.util.List;

/**
 * Created by adwaitkaley on 11/19/16.
 */
public interface Recommender {

    List<Permit> getRecommendations(String permitId, int numberOfRecommendations);

    List<String> getApplicablePermits(String permits[]);

    HashMap evaluate();
}
