#  CURD controller代码
```java
package com.hold.EIDSApi_EC.controller.RegulagTasks;

import com.alibaba.fastjson.JSON;
import com.hold.EIDSApi_EC.common.CommonResult;
import com.hold.EIDSApi_EC.common.IPagination;
import com.hold.EIDSApi_EC.controller.BaseController;
import com.hold.EIDSApi_EC.entity.EC.EcTdRegularTask;
import com.hold.EIDSApi_EC.service.RegulagTasks.RegulagTasksService;
import net.sf.json.JSONObject;
import org.codehaus.jackson.map.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@RestController
public class RegulagTasksController extends BaseController {

    private final RegulagTasksService regulagTasksService;

    public RegulagTasksController(RegulagTasksService regulagTasksService) {
        this.regulagTasksService = regulagTasksService;
    }

    @PostMapping("/getRegularTasks")
    public CommonResult getRegularTasks(@RequestBody String jsonStr) {
        JSONObject obj = GetRequestPostJson(jsonStr);

        CommonResult commonResult = new CommonResult();
        Integer limit = obj.containsKey("pageSize") ? obj.getInt("pageSize") : null;
        try {
            if (limit != null) {
                Object objectData = regulagTasksService.getRegularTasks(
                        obj.containsKey("year") ? obj.getString("year") : null,
                        obj.containsKey("task_name") ? obj.getString("task_name") : null,
                        obj.containsKey("task_type") ? obj.getString("task_type") : null,
                        obj.getString("region_id"),
                        obj.getInt("page"),
                        limit
                );
                IPagination pageData = (IPagination) objectData;
                commonResult.setResultMessage("获取列表成功");
                commonResult.setIsSuccess(true);
                commonResult.setResult(pageData.getList());
                commonResult.setTotal(pageData.getTotal());
                commonResult.setPageNum(pageData.getPages());
            } else {
                Object objectData = regulagTasksService.getRegularTasks(
                        obj.containsKey("year") ? obj.getString("year") : null,
                        obj.containsKey("task_name") ? obj.getString("task_name") : null,
                        obj.containsKey("task_type") ? obj.getString("task_type") : null,
                        obj.getString("region_id"),
                        1,
                        limit
                );
                List pageData = (List) objectData;
                commonResult.setResultMessage("获取列表成功");
                commonResult.setIsSuccess(true);
                commonResult.setResult(pageData);
                commonResult.setTotal(pageData.size());
            }

        } catch (Exception ex) {
            commonResult.setResultMessage(ex.getMessage());
            commonResult.setIsSuccess(false);
        }
        return commonResult;
    }




    @PostMapping("/regularDictionaryQuery")
    public CommonResult regularDictionaryQuery(@RequestBody String jsonStr) {
        JSONObject jsonObject = GetRequestPostJson(jsonStr);
        System.out.println("=========================");
        System.out.println(jsonObject.toString());
        System.out.println("=========================");
        CommonResult commonResult = new CommonResult();

        try {
            commonResult.setResultMessage("获取列表成功");
            commonResult.setIsSuccess(true);
            List listData = regulagTasksService.getDictionary(
                    jsonObject.getString("region_id")
            );
            commonResult.setResult(listData);
        } catch (Exception ex) {
            commonResult.setResultMessage(ex.getMessage());
            commonResult.setIsSuccess(false);
        }
        return commonResult;
    }

    @PostMapping("/regularDepartmentQuery")
    public CommonResult regularDepartmentQuery(@RequestBody String jsonStr) {
        JSONObject jsonObject = GetRequestPostJson(jsonStr);

        CommonResult commonResult = new CommonResult();

        try {
            commonResult.setResultMessage("获取列表成功");
            commonResult.setIsSuccess(true);
            List listData = regulagTasksService.getDepartment(
                    jsonObject.getString("region_id")
            );
            commonResult.setResult(listData);
        } catch (Exception ex) {
            commonResult.setResultMessage(ex.getMessage());
            commonResult.setIsSuccess(false);
        }
        return commonResult;
    }


    @PostMapping("/insertRegularTasks")
    public CommonResult insertRegularTasks(@RequestBody String jsonStr) throws IOException {
        ObjectMapper mapper = new ObjectMapper();
        JSONObject jsonObject = GetRequestPostJson(jsonStr);
        System.out.println(jsonStr);

        CommonResult commonResult = new CommonResult();

        com.alibaba.fastjson.JSONObject jsonObj = com.alibaba.fastjson.JSONObject.parseObject(mapper.writeValueAsString(jsonObject));
        EcTdRegularTask ETRT = com.alibaba.fastjson.JSONObject.toJavaObject(jsonObj, EcTdRegularTask.class);

        System.out.println(ETRT.toString());

        //获取执行单位IDS NAMES
        String TASK_MANA_DO_IDS = jsonObj.getString("TASK_MANA_DO_IDS");
        String TASK_MANA_DO_NAMES = jsonObj.getString("TASK_MANA_DO_NAMES");

        try {
            regulagTasksService.insertOrUpdateRegularTasks(
                    ETRT,
                    jsonObj.getString("REGION_ID"),
                    jsonObj.getString("FENPEI_NAME"),
                    TASK_MANA_DO_IDS,
                    TASK_MANA_DO_NAMES
            );
            commonResult.setResultMessage(jsonObj.containsKey("ID") ? "更新成功" : "新增成功");
            commonResult.setIsSuccess(true);
        } catch (Exception ex) {
            commonResult.setResultMessage(ex.getMessage());
            commonResult.setIsSuccess(false);
        }
        return commonResult;
    }


    @PostMapping("/deleteRegularTasks")
    public CommonResult deleteRegularTasks(@RequestBody String jsonStr) {
        JSONObject jsonObject = GetRequestPostJson(jsonStr);

        CommonResult commonResult = new CommonResult();
        try {
            commonResult.setResultMessage("删除定期巡查任务成功");
            commonResult.setIsSuccess(true);
            regulagTasksService.deleteRegularTasks(jsonObject.getString("ID"));
        } catch (Exception ex) {
            commonResult.setResultMessage(ex.getMessage());
            commonResult.setIsSuccess(false);
        }
        return commonResult;
    }


    @PostMapping("/updateRegularTaskState")
    public CommonResult updateRegularTaskState(@RequestBody String jsonStr) {
        JSONObject jsonObject = GetRequestPostJson(jsonStr);
        CommonResult commonResult = new CommonResult();
        try {
            commonResult.setResultMessage("更新定期巡查任务状态成功");
            commonResult.setIsSuccess(true);
            String[] ids = jsonObject.getString("ID").split(",");
            List<String> IDS = Arrays.asList(ids);
            regulagTasksService.updateRegularTaskState(IDS, jsonObject.getString("TASK_STATE"));
        } catch (Exception ex) {
            commonResult.setResultMessage(ex.getMessage());
            commonResult.setIsSuccess(false);
        }
        return commonResult;
    }


}


```
