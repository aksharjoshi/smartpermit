package com.smartpermit.recommendationengine.repositories;

import com.smartpermit.recommendationengine.model.OwnerDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.*;
import java.util.List;

/**
 * Created by adwaitkaley on 11/12/16.
 */
@Repository
public class OwnerRepository {
    @Autowired
    JdbcTemplate jdbcTemplate;

    public List<OwnerDetails> findAllOwners(){
        String SelectAllOwnersSql = "SELECT " +
                "`ID`, `FIRST_NAME`, `LAST_NAME`, `PHONE_NUM`, `HOUSE_NUM`, `HOUSE_STREET`, `HOUSE_CITY`, `HOUSE_STATE`, `HOUSE_ZIP` " +
                "FROM `OWNER_MASTER`";
        
        return jdbcTemplate.query(SelectAllOwnersSql,new OwnerDetailsRowMapper());
    }

    public List<String> findAllOwnersPhoneNumbers(){
       final String selectAllPhoneNums = "SELECT PHONE_NUM FROM OWNER_MASTER";
       return jdbcTemplate.queryForList(selectAllPhoneNums,String.class);
    }

    public OwnerDetails create(final OwnerDetails ownerDetails){
        final String insertOwnerDetailsQuery = "INSERT INTO `OWNER_MASTER`" +
                "(`FIRST_NAME`, `LAST_NAME`, `PHONE_NUM`, `HOUSE_NUM`, `HOUSE_STREET`, `HOUSE_CITY`, `HOUSE_STATE`, `HOUSE_ZIP`)" +
                " VALUES (?,?,?,?,?,?,?,?)";

        KeyHolder holder = new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
                PreparedStatement preparedStatement = connection.prepareStatement(insertOwnerDetailsQuery, Statement.RETURN_GENERATED_KEYS);
                preparedStatement.setString(1,ownerDetails.getOwnerFirstName());
                preparedStatement.setString(2,ownerDetails.getOwnerLastName());
                preparedStatement.setString(3,ownerDetails.getOwnerPhoneNumber());
                preparedStatement.setString(4,ownerDetails.getOwnerHouseNumber());
                preparedStatement.setString(5,ownerDetails.getOwnerHouseStreetName());
                preparedStatement.setString(6,ownerDetails.getOwnerHouseCity());
                preparedStatement.setString(7,ownerDetails.getOwnerHouseState());
                preparedStatement.setInt(8,ownerDetails.getOwnerHouseZip());
                return preparedStatement;
            }
        },holder);

        String newOwnerId = holder.getKey().toString();
        ownerDetails.setOwnerId(newOwnerId);
        return ownerDetails;

    }
    
    public class OwnerDetailsRowMapper implements RowMapper<OwnerDetails>{

        @Override
        public OwnerDetails mapRow(ResultSet resultSet, int i) throws SQLException {
            OwnerDetails ownerDetails = new OwnerDetails();
            ownerDetails.setOwnerId(resultSet.getString("ID"));
            ownerDetails.setOwnerFirstName(resultSet.getString("FIRST_NAME"));
            ownerDetails.setOwnerLastName(resultSet.getString("LAST_NAME"));
            ownerDetails.setOwnerPhoneNumber(resultSet.getString("PHONE_NUM"));
            ownerDetails.setOwnerHouseNumber(resultSet.getString("HOUSE_NUM"));
            ownerDetails.setOwnerHouseStreetName(resultSet.getString("HOUSE_STREET"));
            ownerDetails.setOwnerHouseCity(resultSet.getString("HOUSE_CITY"));
            ownerDetails.setOwnerHouseState(resultSet.getString("HOUSE_STATE"));
            ownerDetails.setOwnerHouseZip(resultSet.getInt("HOUSE_ZIP"));
            return ownerDetails;
        }
    }

}
