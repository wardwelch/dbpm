<?php
 	require_once("Rest.inc.php");

	class API extends REST {
		public $data = "";
		const DB_SERVER = "127.0.0.1";
		const DB_USER = "root";
		const DB_PASSWORD = "";
		const DB = "bents_test";
		private $db = NULL;
		private $mysqli = NULL;
		public function __construct(){
			parent::__construct();				// Init parent contructor
			$this->dbConnect();					// Initiate Database connection
		}
		
		
		/*
		 *  Connect to Database
		*/
		private function dbConnect(){
			$this->mysqli = new mysqli(self::DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DB);
		}
		
		/*
		 * Dynmically call the method based on the query string
		 */
		public function processApi(){
			$func = strtolower(trim(str_replace("/","",$_REQUEST['x'])));
			if((int)method_exists($this,$func) > 0)
				$this->$func();
			else
				$this->response('',404); // If the method not exist with in this class "Page not found".
		}
				
		private function login(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$email = $this->_request['email'];		
			$password = $this->_request['pwd'];
			if(!empty($email) and !empty($password)){
				if(filter_var($email, FILTER_VALIDATE_EMAIL)){
					$query="SELECT uid, name, email FROM users WHERE email = '$email' AND password = '".md5($password)."' LIMIT 1";
					$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

					if($r->num_rows > 0) {
						$result = $r->fetch_assoc();	
						// If success everythig is good send header as "OK" and user details
						$this->response($this->json($result), 200);
					}
					$this->response('', 204);	// If no records "No Content" status
				}
			}
			
			$error = array('status' => "Failed", "msg" => "Invalid Email address or Password");
			$this->response($this->json($error), 400);
		}
		
		

		private function tenents(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $id = (int)$this->_request['id'];
		    	
			
			if($id > 0){				
			    $query="SELECT * from tenents t where t.building_id = $id order by t.`lastname` desc";
			    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
            }
			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		private function tenent(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){	
				$query="SELECT * from tenents t where t.tenent_id=$id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();	
					$this->response($this->json($result), 200); // send user details
				}
			}
			$this->response('',204);	// If no records "No Content" status
		}
// Building

		private function buildings(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT * from buildings";
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		private function buildingsList(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$query="SELECT building_id id, code, name from buildings";
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		private function building(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){	
				$query="SELECT * from buildings where building_id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();	
					$this->response($this->json($result), 200); // send user details
				}
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		
		private function insertBuilding(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}

			$building = json_decode(file_get_contents("php://input"),true);
			$column_names = array('code', 'name', 'owner', 'street', 'city', 'state', 'zip', 'inactive', 'units');
			$keys = array_keys($building);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $building[$desired_key];
				} 
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
			$query = "INSERT INTO buildings(".trim($columns,',').") VALUES(".trim($values,',').")";
			if(!empty($building)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Building Created Successfully.", "data" => $building);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	//"No Content" status
		}
		
		private function updateBuilding(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$building = json_decode(file_get_contents("php://input"),true);
			$id = (int)$building['id'];
			$column_names = array('code', 'name', 'owner', 'street', 'city', 'state', 'zip', 'inactive', 'units');
			$keys = array_keys($building['building']);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the building received. If key does not exist, insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $building['building'][$desired_key];
				}
				$columns = $columns.$desired_key."='".$$desired_key."',";
			}
			$query = "UPDATE buildings SET ".trim($columns,',')." WHERE building_id=$id";
			if(!empty($building)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Building ".$id." Updated Successfully.", "data" => $building);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// "No Content" status
		}
		
		private function deleteBuilding(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){				
				$query="DELETE FROM buildings WHERE building_id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Successfully deleted one record.");
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// If no records "No Content" status
		}
// rents
		private function rents(){
		    
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $id = (int)$this->_request['id'];
		    	
			
			if($id > 0){				
			    $query="SELECT  r.* , concat(lastname,', ',firstname) tenant from rents r LEFT JOIN  tenents t ON r.tenent_id = t.tenent_id where r.building_id = $id";
			    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
            }
			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}

		private function tenent_rents(){
		    
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $id = (int)$this->_request['id'];
		    	
			
			if($id > 0){				
			    $query="SELECT  r.* , concat(lastname,', ',firstname) tenant from rents r LEFT JOIN  tenents t ON r.tenent_id = t.tenent_id where r.tenent_id = $id order by r.sort_month desc";
			    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
            }
			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}

		private function unit_rents(){
		    
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $uid = (int)$this->_request['uid'];
		    
		    	
			
			if($uid > 0){				
			    $query="SELECT  r.* , concat(lastname,', ',firstname) tenant from rents r LEFT JOIN  tenents t ON r.tenent_id = t.tenent_id where r.unit_id = $uid order by r.sort_month desc";
			    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
            }
			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		private function rent(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){	
				$query="SELECT * from rents where rent_id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();	
					$this->response($this->json($result), 200); // send user details
				}
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		
		private function insertRent(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}

			$rent = json_decode(file_get_contents("php://input"),true);
			$column_names = array( `building_id`, `unit_id`, `tenent_id`, `unitid`, `month`, `date_paid`, `receipt`, `rent_paid`, `due_this_mo`, `tenant_name`, `deposit_paid`, `comments`, `rent_owed`, `sort_month`, `adjustment`);
			$keys = array_keys($rent);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $rent[$desired_key];
				}
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
			
			
			$query = "INSERT INTO rents(".trim($columns,',').") VALUES(".trim($values,',').")";
			if(!empty($rent)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Rent Created Successfully.", "data" => $rent);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	//"No Content" status
		}
		
		private function addRents(){
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$bid = (int)$this->_request['id'];
            $tmp = (int)date_parse($this->_request['m']);
            $n =$tmp['month']; 
            $date = date_create();
            date_date_set($date, $this->_request['y'], $n-1, 01);
            $m = substr(strtoupper(date_format($date, 'M')),0,3);
            $y = date_format($date, 'Y');
            $lastMonth ="$m/$y";
            $thisMonth = strtoupper(substr($this->_request['m'],0,3))."/".$this->_request['y'];
			if($bid > 0 ){				
                $query = "SELECT  u.*, concat(lastname,', ',firstname) tenant_name from units u LEFT JOIN  tenents t ON u.tenent_id = t.tenent_id where u.building_id = $bid and u.tenent_id != 0"; 
			    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
            }
			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
				    $row['month'] = $thisMonth;
				    $row['sort_month'] = $this->_request['y']."-".str_pad($n,2,'0',STR_PAD_LEFT)."-01";
				    $row['comments'] = "auto added";
				    $row['due_this_mo'] = $row['price'];
				    $row['rent_owed'] = $row['price'];
				    $row['tenent_name'] = $row['tenent_name'];
					$result[] = $row;
				    $this->addRent($row);
				}
				print_r($result);exit;
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		private function addRent($arr){
			$rent = $arr;

			$column_names = array(
                            'building_id', 
                            'unit_id', 
                            'tenent_id', 
                            'unitid', 
                            'month', 
                            'date_paid', 
                            'receipt', 
                            'rent_paid', 
                            'due_this_mo', 
                            'tenant_name', 
                            'deposit_paid', 
                            'comments', 
                            'rent_owed', 
                            'sort_month', 
                            'adjustment'
			                );
			$keys = array_keys($rent);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $this->mysqli->real_escape_string($rent[$desired_key]);
				}
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
            
			$query = "INSERT INTO rents(".trim($columns,',').") VALUES(".trim($values,',').")";
			if(!empty($rent)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
			}else
				$this->response('',204);	//"No Content" status
		}
		
		private function updateRent(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$rent = json_decode(file_get_contents("php://input"),true);
			$id = (int)$rent['id'];
			$column_names = array(
                            'building_id', 
                            'unit_id', 
                            'tenent_id', 
                            'unitid', 
                            'month', 
                            'date_paid', 
                            'receipt', 
                            'rent_paid', 
                            'due_this_mo', 
                            'tenant_name', 
                            'deposit_paid', 
                            'comments', 
                            'rent_owed', 
                            'sort_month', 
                            'adjustment'
			                );
			$keys = array_keys($rent['rent']);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the rent received. If key does not exist, insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $rent['rent'][$desired_key];
				}
				$columns = $columns.$desired_key."='".$$desired_key."',";
			}
			$query = "UPDATE rents SET ".trim($columns,',')." WHERE rent_id=$id";
			if(!empty($rent)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Rent ".$id." Updated Successfully.", "data" => $rent);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// "No Content" status
		}
		
		private function deleteRent(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){				
				$query="DELETE FROM rents WHERE rent_id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Successfully deleted one record.");
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// If no records "No Content" status
		}
		
// units
		private function units(){
		    
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $id = (int)$this->_request['id'];
		    	
			
			if($id > 0){				
			    $query="SELECT u.unit_id unit_id, unitnum, t.tenent_id, concat(lastname,', ',firstname) tenant, `type`, u.`status` status, price from units u LEFT JOIN  tenents t ON u.tenent_id = t.tenent_id where u.building_id = $id";
			    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
            }
			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		private function unit(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){	
			    $query="SELECT u.*, concat(lastname,', ',firstname) tenant from units u LEFT JOIN  tenents t ON u.tenent_id = t.tenent_id where u.unit_id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();	
					$this->response($this->json($result), 200); // send user details
				}
			}
			$this->response('',204);	// If no records "No Content" status
		}
		private function prices(){
		    
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $id = $this->_request['id'];
		    	
			
			    $query="SELECT * from unit_prices";
			    $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
                 
			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		private function price(){	
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){	
			    $query="SELECT * from unit_prices where id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				if($r->num_rows > 0) {
					$result = $r->fetch_assoc();	
					$this->response($this->json($result), 200); // send user details
				}
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		private function insertPrice(){
		    $this->clearPrices();
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$price = json_decode(file_get_contents("php://input"),true);
			$column_names = array( 'building_id', 'unit_id', 'unitnum' ,'begin_date', 'end_date', 'rent','active');
			$keys = array_keys($price);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the price received. If blank insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $price[$desired_key];
				}
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
			
			$query = "INSERT INTO unit_prices(".trim($columns,',').") VALUES(".trim($values,',').")";
			if(!empty($price)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Price Created Successfully.", "data" => $price);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	//"No Content" status
		}

		private function updatePrice(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$price = json_decode(file_get_contents("php://input"),true);
			$id = (int)$price['id'];
			$column_names = array(
                            'building_id', 
                            'unit_id', 
                            'unitnum',
                            'begin_date',
                            'end_date',
                            'rent',
                            'active'
			                );
			$keys = array_keys($price['price']);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the price received. If key does not exist, insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $price['price'][$desired_key];
				}
				$columns = $columns.$desired_key."='".$$desired_key."',";
			}
			$query = "UPDATE unit_prices SET ".trim($columns,',')." WHERE id=$id";
			if(!empty($price)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Price ".$id." Updated Successfully.", "data" => $price);
				$query="update unit_prices set active = 0 where id != $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// "No Content" status
		}

		private function clearPrices(){
				$query="update unit_prices set active = 0 where active != 0";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
		}

// 		private function insertUnit(){
// 
//             $unit = array( 
//                 "building" =>"123MAIN",
//                 "building_id" =>"40",
//                 "price" =>"123",
//                 "status" =>"Vacant",
//                 "tenent_id" =>0,
//                 "type" => "1 Bedroom",
//                 "unitid" => "123MAIN/1",
//                 "total_bal_due" => "1.00",
//                 "unitnum" => "1"
//             );
// 			//$unit = json_decode(file_get_contents("php://input"),true);
// 			$column_names = array( 'building_id', 'tenent_id', 'building', 'unitnum', 'price', 'type', 'status', 'unitid','total_bal_due');
// 			$keys = array_keys($unit);
// 			$columns = '';
// 			$values = '';
// 			foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
// 			   if(!in_array($desired_key, $keys)) {
// 			   		$$desired_key = '';
// 				}else{
// 					$$desired_key = $unit[$desired_key];
// 				} 
// 				$columns = $columns.$desired_key.',';
// 				$values = $values."'".$$desired_key."',";
// 			}
// 			$query = "INSERT INTO units(".trim($columns,',').") VALUES(".trim($values,',').")";
// 			if(!empty($unit)){
// 				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
// 				$success = array('status' => "Success", "msg" => "Unit Created Successfully.", "data" => $unit);
// 				$this->response($this->json($success),200);
// 			}else
// 				$this->response('',204);	//"No Content" status
// 		}

		private function insertUnit(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}

			$unit = json_decode(file_get_contents("php://input"),true);
			$column_names = array( 'building_id', 'tenent_id', 'building', 'unitnum', 'price', 'type', 'status', 'unitid','total_bal_due');
			$keys = array_keys($unit);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $unit[$desired_key];
				}
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
			$query = "INSERT INTO units(".trim($columns,',').") VALUES(".trim($values,',').")";
			if(!empty($unit)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Unit Created Successfully.", "data" => $unit);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	//"No Content" status
		}
		
		private function updateUnit(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$unit = json_decode(file_get_contents("php://input"),true);
			$id = (int)$unit['id'];
			$column_names = array('unit_id', 'building_id', 'tenent_id', 'building', 'unitnum', 'price', 'type', 'status', 'total_bal_due');
			$keys = array_keys($unit['unit']);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the unit received. If key does not exist, insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $unit['unit'][$desired_key];
				}
				$columns = $columns.$desired_key."='".$$desired_key."',";
			}
			$query = "UPDATE units SET ".trim($columns,',')." WHERE unit_id=$id";
			if(!empty($unit)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Unit ".$id." Updated Successfully.", "data" => $unit);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// "No Content" status
		}
		
		private function deleteUnit(){
			if($this->get_request_method() != "DELETE"){
				$this->response('',406);
			}
			$id = (int)$this->_request['id'];
			if($id > 0){				
				$query="DELETE FROM units WHERE unit_id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Successfully deleted one record.");
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// If no records "No Content" status
		}
		
		
		private function insertTenent(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$tenent = json_decode(file_get_contents("php://input"),true);
			$column_names = array( 'building_id', 'unit_id', 'unitid', 'lastname', 'firstname', 'ssn', 'creditcard', 'cardnumber', 'unused', 'status', 'deposit_paid', 'firstmo_paid', 'lastmo_paid', 'other_paid', 'balance_due', 'move_in', 'move_out', '30_day_notice', 'other', 'drivers_license');
			$keys = array_keys($tenent);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the customer received. If blank insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $tenent[$desired_key];
				}
				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}
			$query = "INSERT INTO tenents(".trim($columns,',').") VALUES(".trim($values,',').")";
			if(!empty($tenent)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$tenent['tenent_id'] = $this->mysqli->insert_id;
				$tid = (int)$tenent['tenent_id'];
				$uid = (int)$tenent['unit_id'];
                $query = "update units set tenent_id = $tid, status = 'Occupied' where unit_id = $uid";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);				
				$success = array('status' => "Success", "msg" => "tenent Created Successfully.", "data" => $tenent);
				
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	//"No Content" status
		}
		private function lastInsertID(){
		    
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}		    	
			
            $query="SELECT last_insert_id() id";
            $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		
		private function getRentsRange(){
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}
		    $id = (int)$this->_request['id'];
		    	
			
			if($id > 0){				
                $query="select (select month from rents where building_id = $id order by `sort_month` asc limit 1) as first,(select month from rents where building_id = $id order by `sort_month` desc limit 1) as last from dual";
                $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
            }
			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		
		private function firstYear(){
		    
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}		    	
			
            $query="SELECT min(sort_month) id from rents";
            $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$result[] = array("ID" => $query);
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		private function lastYear(){
		    
			if($this->get_request_method() != "GET"){
				$this->response('',406);
			}		    	
			
            $query="SELECT max(sort_month) id from rents";
            $r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
			if($r->num_rows > 0){
				$result = array();
				while($row = $r->fetch_assoc()){
					$result[] = $row;
				}
				$this->response($this->json($result), 200); // send user details
			}
			$this->response('',204);	// If no records "No Content" status
		}
		
		private function updateTenent(){
			if($this->get_request_method() != "POST"){
				$this->response('',406);
			}
			$tenent = json_decode(file_get_contents("php://input"),true);
			$id = (int)$tenent['id'];
			$column_names = array( 'building_id', 'unit_id', 'unitid', 'lastname', 'firstname', 'ssn', 'creditcard', 'cardnumber', 'unused', 'status', 'deposit_paid', 'firstmo_paid', 'lastmo_paid', 'other_paid', 'balance_due', 'move_in', 'move_out', '30_day_notice', 'other', 'drivers_license');
			$keys = array_keys($tenent['tenent']);
			$columns = '';
			$values = '';
			foreach($column_names as $desired_key){ // Check the unit received. If key does not exist, insert blank into the array.
			   if(!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				}else{
					$$desired_key = $tenent['tenent'][$desired_key];
				}
				$columns = $columns.$desired_key."='".$$desired_key."',";
			}
			$query = "UPDATE tenents SET ".trim($columns,',')." WHERE tenent_id=$id";
			if(!empty($tenent)){
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => "Success", "msg" => "Tenent ".$id." Updated Successfully.", "data" => $tenent);
				$this->response($this->json($success),200);
			}else
				$this->response('',204);	// "No Content" status
		}
		
		
		/*
		 *	Encode array into JSON
		*/
		private function json($data){
			if(is_array($data)){
				return json_encode($data);
			}
		}
	}
	
	// Initiiate Library
	
	$api = new API;
	$api->processApi();
?>