# 后端怎么用
- 这里本质上就是接收参数 存库而已

```java

 @PostMapping("/saveCheckMedia")
    public CommonResult saveCheckMedia(@RequestBody String jsonStr) throws IOException {
        JSONObject jsonObject = GetRequestPostJson(jsonStr);
        CommonResult commonResult = new CommonResult();
        ObjectMapper mapper = new ObjectMapper();
        EcTdCheckMedia ETCM = com.alibaba.fastjson.JSONObject.parseObject(mapper.writeValueAsString(jsonObject), EcTdCheckMedia.class);

        ETCM.setOPERATE_TIME(LocalDate.now());

        try {
            checkMediaRepository.save(ETCM);
            commonResult.setResultMessage("保存媒体文件成功");
            commonResult.setResult(Arrays.asList(ETCM));
        } catch (Exception ex) {
            commonResult.setResultMessage(ex.getMessage());
            commonResult.setIsSuccess(false);
        }
        return commonResult;
    }


    /**
     * 删除【定期巡查任务记录】
     *
     * @param jsonStr
     * @return
     */
    @PostMapping("/deleteMediaById")
    public CommonResult deleteMediaById(@RequestBody String jsonStr) {
        JSONObject jsonObject = GetRequestPostJson(jsonStr);

        CommonResult commonResult = new CommonResult();
        try {
            commonResult.setResultMessage("删除媒体成功");
            commonResult.setIsSuccess(true);
            checkMediaRepository.deleteById(jsonObject.getString("id"));
        } catch (Exception ex) {
            commonResult.setResultMessage(ex.getMessage());
            commonResult.setIsSuccess(false);
        }
        return commonResult;
    }
    ```