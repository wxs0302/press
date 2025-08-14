#  CURD service代码
- 这里分别有原生SQL、HQL、JPA的查询方式的例子，根据实际情况选择

```java

package com.hold.EIDSApi_EC.service.RegulagTasks;

import com.hold.EIDSApi_EC.common.IPagination;
import com.hold.EIDSApi_EC.entity.EC.EcTdRegularTask;
import com.hold.EIDSApi_EC.entity.EC.EcTdRegularTasksExe;
import com.hold.EIDSApi_EC.entity.EC.EcTdTceMana;
import com.hold.EIDSApi_EC.repository.RegularTasks.CheckMediaRepository;
import com.hold.EIDSApi_EC.repository.RegularTasks.ManaRepository;
import com.hold.EIDSApi_EC.repository.RegularTasks.RegularTasksExeRepository;
import com.hold.EIDSApi_EC.repository.RegularTasks.RegularTasksRepository;
import com.hold.EIDSApi_EC.service.BaseService;
import com.hold.EIDSApi_EC.utils.ResultHandleUtils;
import net.sf.json.JSONObject;
import org.apache.commons.lang3.StringUtils;
import org.codehaus.jackson.map.ObjectMapper;
import org.hibernate.Session;
import org.hibernate.query.NativeQuery;
import org.hibernate.query.Query;
import org.hibernate.transform.Transformers;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RegulagTasksService extends BaseService {

    @Autowired
    RegularTasksRepository regularTasksRepository;

    @Autowired
    ManaRepository manaRepository;

    @Autowired
    RegularTasksExeRepository regularTasksExeRepository;

    @Autowired
    CheckMediaRepository checkMediaRepository;

    /**
     * 获取字典表数据
     *
     * @return
     */
    @Transactional(readOnly = true)
    public List<Object> getDictionary(String REGION_ID) {
        Query query = getEntityManager()
                .unwrap(Session.class)
                .createQuery("select BTD from BiTsDictionary BTD  where TYPE = 'E1' and REGION_ID = :REGION_ID");
        query.setParameter("REGION_ID", REGION_ID);

        return query.getResultList();
    }

    /**
     * 获取负责科室和执行科室
     *
     * @param REGION_ID
     * @return
     */

    @Transactional(readOnly = true)
    public List getDepartment(String REGION_ID) {

        Query query = getEntityManager()
                .createNativeQuery(" select * from BI_TB_DEPARTMENT where IS_CHECK_DEAL = 1 AND REGION_ID = :REGION_ID ")
                .unwrap(NativeQuery.class)
                .setResultTransformer(Transformers.ALIAS_TO_ENTITY_MAP);
        query.setParameter("REGION_ID", REGION_ID);
        return query.getResultList();
    }

    /**
     * 获取定期巡检任务列表
     */
    @Transactional(readOnly = true)
    public Object getRegularTasks(String YEAR, String TASK_NAME, String TASK_TYPE, String REGION_ID, Integer page, Integer limit) throws IllegalAccessException {
        StringBuilder sql = new StringBuilder();
        sql.append("select "
                + String.join(",", ResultHandleUtils.readAttributeValue(EcTdRegularTask.class, "ETRT")) +
                ", " +
                "BTP.NAME as PUBLISH_USER_NAME " +
                ", " +
                "BTDY.DIC_VALUE as TASK_TYPE_NAME " +
                ", " +
                "BTD.NAME as TASK_MANA_NAME " +
                " from EcTdRegularTask ETRT " +
                " left join BiTbPersonnel BTP on ETRT.USER_ID = BTP.ID" + //发布人
                " left join BiTbDepartment BTD on ETRT.TASK_MANA = BTD.ID" + // 负责科室
                " left join BiTsDictionary BTDY on ETRT.TASK_TYPE = BTDY.DIC_KEY and BTDY.REGION_ID = :REGION_ID and BTDY.TYPE = 'E1'" + //任务类型
                " where ETRT.REGION_ID = :REGION_ID ");
        String countSql = "select count(ETRT) from EcTdRegularTask ETRT where ETRT.REGION_ID = :REGION_ID";

        //查询条件
        HashMap map = new HashMap();
        map.put("REGION_ID", REGION_ID);
        //年份
        if (StringUtils.isNotEmpty(YEAR)) {
            sql.append(" and ETRT.BEGIN_TIME >= :startDate and ETRT.BEGIN_TIME < :endDate");
            countSql += " and ETRT.BEGIN_TIME >= :startDate and ETRT.BEGIN_TIME < :endDate";
            LocalDate startDate = LocalDate.of(Integer.parseInt(YEAR), 1, 1);
            LocalDate endDate = LocalDate.of(Integer.parseInt(YEAR) + 1, 1, 1);
            map.put("startDate", startDate);
            map.put("endDate", endDate);
        }

        //任务名称模糊检索
        if (StringUtils.isNotEmpty(TASK_NAME)) {
            sql.append(" and ETRT.TASK_NAME like :taskName");
            countSql += " and ETRT.TASK_NAME like :taskName";
            map.put("taskName", "%" + TASK_NAME + "%");
        }

        //任务类型
        if (StringUtils.isNotEmpty(TASK_TYPE)) {
            sql.append(" and ETRT.TASK_TYPE = :TASK_TYPE");
            countSql += " and ETRT.TASK_TYPE = :TASK_TYPE";
            map.put("TASK_TYPE", TASK_TYPE);
        }

        //排序
        sql.append(" order by ETRT.BEGIN_TIME asc , ETRT.END_TIME asc ");

        //分页
        if (limit != null) {
            IPagination pageData = this.search(page, limit, sql.toString(), countSql, map, Map.class);

            if (!pageData.getList().isEmpty()) {
                for (Object mapData : pageData.getList()) {
                    HashMap mapDataHashMap = (HashMap) mapData;
                    List<EcTdTceMana> ecTdTceManaList = manaRepository.findAllByTASK_ID(mapDataHashMap.get("ID").toString());
                    mapDataHashMap.put("MANA_LIST", ecTdTceManaList);
                }
            }

            return pageData;
        }

        //全量用于Excel导出
        else {
            List pageData = this.search(sql.toString(), map, Map.class);
            if (!pageData.isEmpty()) {
                for (Object mapData : pageData) {
                    HashMap mapDataHashMap = (HashMap) mapData;
                    List<EcTdTceMana> ecTdTceManaList = manaRepository.findAllByTASK_ID(mapDataHashMap.get("ID").toString());
                    mapDataHashMap.put("MANA_LIST", ecTdTceManaList);
                }
            }
            return pageData;
        }

    }


    /**
     * 获取定期巡检任务列表-根据年/月-用于定期巡查执行记录的左侧日历
     */
    @Transactional(readOnly = true)
    public List getRegularTasksAllByYearAndMonth(String YEAR, String MONTH, String REGION_ID) throws IllegalAccessException {
        StringBuilder sql = new StringBuilder();
        sql.append("select "
                + String.join(",", ResultHandleUtils.readAttributeValue(EcTdRegularTask.class, "ETRT")) +
                ", " +
                "BTP.NAME as PUBLISH_USER_NAME " +
                ", " +
                "BTDY.DIC_VALUE as TASK_TYPE_NAME " +
                ", " +
                "BTD.NAME as TASK_MANA_NAME " +
                " from EcTdRegularTask ETRT " +
                " left join BiTbPersonnel BTP on ETRT.USER_ID = BTP.ID" + //发布人
                " left join BiTbDepartment BTD on ETRT.TASK_MANA = BTD.ID" + // 负责科室
                " left join BiTsDictionary BTDY on ETRT.TASK_TYPE = BTDY.DIC_KEY and BTDY.REGION_ID = :REGION_ID and BTDY.TYPE = 'E1'" + //任务类型
                " where ETRT.REGION_ID = :REGION_ID ");

        //查询条件
        HashMap map = new HashMap();
        map.put("REGION_ID", REGION_ID);

        //年份与月份
        if (StringUtils.isNotEmpty(YEAR)) {
            sql.append(" and ETRT.BEGIN_TIME >= :startDate and ETRT.BEGIN_TIME < :endDate");
            LocalDate startDate = LocalDate.of(Integer.parseInt(YEAR), Integer.parseInt(MONTH), 1);
            LocalDate endDate = YearMonth.of(Integer.parseInt(YEAR), Integer.parseInt(MONTH)).atEndOfMonth();
            map.put("startDate", startDate);
            map.put("endDate", endDate);
        }


        //排序
        sql.append(" order by ETRT.BEGIN_TIME asc , ETRT.END_TIME asc ");

        List pageData = this.search(sql.toString(), map, Map.class);
        //负责执行管理单位
        if (!pageData.isEmpty()) {
            for (Object mapData : pageData) {
                HashMap mapDataHashMap = (HashMap) mapData;
                List<EcTdTceMana> ecTdTceManaList = manaRepository.findAllByTASK_ID(mapDataHashMap.get("ID").toString());
                mapDataHashMap.put("MANA_LIST", ecTdTceManaList);
            }
        }

        //关联定期任务执行记录
        if (!pageData.isEmpty()) {
            for (Object mapData : pageData) {
                HashMap mapDataHashMap = (HashMap) mapData;
                List<EcTdRegularTasksExe> ecTdRegularTasksExeList = regularTasksExeRepository.findAllByTASK_ID(mapDataHashMap.get("ID").toString());
                mapDataHashMap.put("EXE_LIST", ecTdRegularTasksExeList);
            }
        }

        return pageData;

    }


    /**
     * 新增或更新定期巡检任务
     *
     * @throws IOException
     * @Param ETRT 保存更新实体
     * @Param REGION_ID 地区ID
     * @Param TASK_MANA_DO_IDS 执行单位ID数组字符串
     * @Param TASK_MANA_DO_NAMES 执行单位名称数组字符串
     */
    //多表操作回滚
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void insertOrUpdateRegularTasks(EcTdRegularTask ETRT, String REGION_ID, String FENPEI_NAME, String TASK_MANA_DO_IDS, String TASK_MANA_DO_NAMES) throws IOException {

        // 🏳️‍🌈 新增时-设置任务状态为初始状态（01表示已上报）
        if (ETRT.getID() == null) {
            ETRT.setTASK_STATE("01");
        }

        // 设置操作时间为当前日期
        ETRT.setOPERATE_TIME(LocalDate.now());

        regularTasksRepository.save(ETRT);

        if (TASK_MANA_DO_IDS != null && TASK_MANA_DO_NAMES != null) {
            this.deleteOldNoReadManaAndInsertNewNamas(REGION_ID, FENPEI_NAME, ETRT.getID(), TASK_MANA_DO_IDS, TASK_MANA_DO_NAMES);
        }

    }

    /**
     * 🟨本方法用于当新增和更新定期巡检任务时(insertOrUpdateRegularTasks)，变更了执行单位字段，
     * 🟨则需要删除旧的未阅读记录并插入新的执行单位记录
     *
     * @param REGION_ID
     * @param REGULAR_TASK_ID
     * @param TASK_MANA_DO_IDS
     * @param TASK_MANA_DO_NAMES
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deleteOldNoReadManaAndInsertNewNamas(String REGION_ID, String FENPEI_NAME, String REGULAR_TASK_ID, String TASK_MANA_DO_IDS, String TASK_MANA_DO_NAMES) {
        //🟥1.删除巡检涉及单位表中当前任务未阅读的记录
        manaRepository.deleteNoReadManaByTaskId(REGULAR_TASK_ID);
        //🟩2.插入本次变更的执行单位
        String[] TASK_MANA_DO_IDS_ARR = TASK_MANA_DO_IDS.split(",");
        String[] TASK_MANA_DO_NAMES_ARR = TASK_MANA_DO_NAMES.split(",");
        if (TASK_MANA_DO_IDS_ARR.length > 0) {
            for (int i = 0; i < TASK_MANA_DO_IDS_ARR.length; i++) {
                EcTdTceMana ecTdTceMana = new EcTdTceMana();
                ecTdTceMana.setREGION_ID(REGION_ID);
                ecTdTceMana.setTASK_ID(REGULAR_TASK_ID);
                ecTdTceMana.setDEPT_ID(TASK_MANA_DO_IDS_ARR[i]);
                ecTdTceMana.setDEPT_NAME(TASK_MANA_DO_NAMES_ARR[i]);
                ecTdTceMana.setFENPEI_NAME(FENPEI_NAME);
                ecTdTceMana.setREAD_STATE("未阅读");
                manaRepository.save(ecTdTceMana);
            }
        }
    }

    /**
     * 删除定期巡检任务
     * 1 删除本表记录(巡检任务主表)
     * 2 删除巡检任务记录表记录（子表）
     * 3 删除巡检多媒体记载表记录(附件表)
     *
     * @param ID 删除任务ID
     * @throws IOException
     */
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deleteRegularTasks(String ID) throws IOException {
        regularTasksRepository.deleteById(ID);
        regularTasksExeRepository.deleteByTASK_ID(ID);
        checkMediaRepository.deleteByOBJECT_ID(ID);
    }

    @Transactional
    public void updateRegularTaskState(List<String> IDS, String TASK_STATE) {
        regularTasksRepository.updateRegularTaskState(IDS, TASK_STATE);
    }

}

```
