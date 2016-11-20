package com.smartpermit.recommendationengine.repositories;

import com.smartpermit.recommendationengine.model.Permit;
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
 * Created by adwaitkaley on 11/14/16.
 */
@Repository
public class PermitRepository {
    @Autowired
    JdbcTemplate jdbcTemplate;

    public List<Permit> findAllPermits(){
        String selectAllPermitsSql = "SELECT " +
                "`ID`, `JOB_TYPE`, `PERMIT_TYPE`, `PERMIT_SUBTYPE`" +
                "FROM `PERMIT_MASTER`";

        return jdbcTemplate.query(selectAllPermitsSql,new PermitRowMapper());
    }

    public Permit create(final Permit permit){
        final String insertPermitSql = "INSERT INTO `PERMIT_MASTER`" +
                "(`JOB_TYPE`, `PERMIT_TYPE`, `PERMIT_SUBTYPE`)" +
                " VALUES (?,?,?)";

        KeyHolder holder = new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
                PreparedStatement preparedStatement = connection.prepareStatement(insertPermitSql, Statement.RETURN_GENERATED_KEYS);
                preparedStatement.setString(1,permit.getPermitJobType());
                preparedStatement.setString(2,permit.getPermitType());
                preparedStatement.setString(3,permit.getPermitSubtype());
                return preparedStatement;
            }
        },holder);

        String newPermitId = holder.getKey().toString();
        permit.setPermitId(newPermitId);
        return permit;

    }

    public Permit findPermitbyId(long itemID) {
        final String selectPermitByIdSql = "SELECT ID,JOB_TYPE,PERMIT_TYPE,PERMIT_SUBTYPE" +
                " FROM PERMIT_MASTER" +
                " WHERE ID = ?";
        return jdbcTemplate.queryForObject(selectPermitByIdSql, new Object[]{itemID}, new PermitRowMapper());
    }

    public class PermitRowMapper implements RowMapper<Permit> {
        @Override
        public Permit mapRow(ResultSet resultSet, int i) throws SQLException {
            Permit permit = new Permit();
            permit.setPermitId(resultSet.getString("ID"));
            permit.setPermitJobType(resultSet.getString("JOB_TYPE"));
            permit.setPermitType(resultSet.getString("PERMIT_TYPE"));
            permit.setPermitSubtype(resultSet.getString("PERMIT_SUBTYPE"));
            return permit;
        }
    }
}
