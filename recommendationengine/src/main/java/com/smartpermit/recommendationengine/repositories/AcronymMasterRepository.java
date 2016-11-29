package com.smartpermit.recommendationengine.repositories;

import com.smartpermit.recommendationengine.model.Acronym;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

/**
 * Created by adwaitkaley on 11/28/16.
 */
@Repository
public class AcronymMasterRepository {
    @Autowired
    JdbcTemplate jdbcTemplate;

    public List<Acronym> findAllAcronymDescriptions(){
        String selectAllAcronymsSql = "SELECT " +
                "`ID`,`ACRONYM`, `DESCRIPTION`" +
                "FROM `ACRONYM_MASTER`";

        return jdbcTemplate.query(selectAllAcronymsSql,new AcronymRowMapper());
    }

    public class AcronymRowMapper implements RowMapper<Acronym> {
        @Override
        public Acronym mapRow(ResultSet resultSet, int i) throws SQLException {
            Acronym acronym = new Acronym();
            acronym.setId(resultSet.getString("ID"));
            acronym.setAcronym(resultSet.getString("ACRONYM"));
            acronym.setDescription(resultSet.getString("DESCRIPTION"));
            return acronym;
        }
    }
}
