package com.smartpermit.recommendationengine.repositories;

import com.smartpermit.recommendationengine.model.RecoMaster;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Created by adwaitkaley on 12/5/16.
 */
@Repository
public class RecoRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    public List<RecoMaster> findAllRecommendations(){
        String selectAllPermitsSql = "SELECT " +
                "`ID`, `PERMIT_ID`, `R_ID`" +
                "FROM `RECO_MASTER`";

        return jdbcTemplate.query(selectAllPermitsSql,new RecoMasterRowMapper());
    }

    public List<Integer> findAllRecommendationsByPermitId(int id){
        final String selectPermitByIdSql = "SELECT R_ID" +
                " FROM RECO_MASTER" +
                " WHERE PERMIT_ID = ? ";
        return jdbcTemplate.queryForList(selectPermitByIdSql, new Object[]{id}, Integer.class);
    }

    public class RecoMasterRowMapper implements RowMapper<RecoMaster> {
        @Override
        public RecoMaster mapRow(ResultSet resultSet, int i) throws SQLException {
            RecoMaster recoMaster = new RecoMaster();
            recoMaster.setId(resultSet.getInt("ID"));
            recoMaster.setPermitId(resultSet.getInt("PERMIT_ID"));
            recoMaster.setRecoId(resultSet.getInt("R_ID"));
            return recoMaster;
        }
    }
}
