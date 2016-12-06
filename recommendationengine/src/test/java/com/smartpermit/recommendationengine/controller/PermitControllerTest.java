package com.smartpermit.recommendationengine.controller;

import com.smartpermit.recommendationengine.model.Permit;
import com.smartpermit.recommendationengine.recommender.Recommender;
import com.smartpermit.recommendationengine.repositories.PermitDetailsRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import org.springframework.http.ResponseEntity;

import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

/**
 * Created by adwaitkaley on 12/4/16.
 */
@RunWith(MockitoJUnitRunner.class)
public class PermitControllerTest {

    PermitMainController permitMainController;

    @Mock
    PermitDetailsRepository permitDetailsRepository;

    @Mock
    Recommender recommenderImpl;

    @Before
    public void setup(){
        permitMainController = new PermitMainController();
        permitMainController.setRecommenderImpl(recommenderImpl);
    }

    @Test
    public void successfulRecommendations(){
        expectRecommenderToRecommend();
        ResponseEntity response = permitMainController.recommendData("A2",1);
        verifyRecommenderWasCalled();
        assertEquals(response.getStatusCode().value(),200);
    }

    private void verifyRecommenderWasCalled() {
        verify(recommenderImpl).getRecommendations(anyString(),anyInt());
    }

    private void expectRecommenderToRecommend() {
        ArrayList<Permit> permitList = new ArrayList<Permit>();
        permitList.add(new Permit("A1","AL","N/A"));
        when(recommenderImpl.getRecommendations(anyString(),anyInt())).thenReturn(permitList);
    }

}
